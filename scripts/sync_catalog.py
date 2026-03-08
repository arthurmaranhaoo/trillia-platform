import os
import pandas as pd
from supabase import create_client, Client
import math

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean_value(val):
    if pd.isna(val):
        return None
    if isinstance(val, float) and math.isnan(val):
        return None
    return val

def sync_catalog():
    excel_path = "../data/catalog.xlsx"
    if not os.path.exists(excel_path):
        print(f"File not found: {excel_path}")
        return

    print("Reading catalog from Excel...")
    df = pd.read_excel(excel_path)
    
    print("Syncing with Supabase...")
    success_count = 0
    
    for index, row in df.iterrows():
        try:
            # Construct the payload
            payload = {
                "sku": str(row['sku']),
                "name": str(row['name']),
                "description": clean_value(row.get('description')),
                "category": clean_value(row.get('category')),
                "price": float(row['price']) if pd.notna(row.get('price')) else None,
                "stock_status": clean_value(row.get('stock_status')),
            }
            
            # Add metadata if present
            if 'metadata' in row and pd.notna(row['metadata']):
                import json
                try:
                    payload['metadata'] = json.loads(row['metadata'])
                except:
                    payload['metadata'] = {"raw": str(row['metadata'])}
            
            # Upsert based on SKU
            data, count = supabase.table('products').upsert(payload, on_conflict='sku').execute()
            success_count += 1
            print(f"  Synced: {row['sku']} - {row['name']}")
            
        except Exception as e:
            print(f"  Error syncing row {index} (SKU: {row.get('sku')}): {e}")

    print(f"Catalog sync complete! Successfully processed {success_count} items.")

if __name__ == "__main__":
    sync_catalog()
