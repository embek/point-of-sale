CREATE OR REPLACE FUNCTION restore_stock_after_soft_delete()
RETURNS trigger AS $$
	DECLARE
		f RECORD;
    BEGIN
        IF OLD.is_deleted = false AND NEW.is_deleted = true THEN
			FOR f IN SELECT quantity,itemcode
					FROM purchaseitems
					WHERE invoice = NEW.invoice
			LOOP
				UPDATE goods
				SET stock = stock - f.quantity
				WHERE barcode = f.itemcode;
			END LOOP;
		END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;