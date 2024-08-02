CREATE TRIGGER restore_stock_after_soft_delete_trigger
AFTER UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION restore_stock_after_soft_delete();