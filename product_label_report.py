import markupsafe
from odoo.tools import format_date
from odoo import fields, models
import logging

_logger = logging.getLogger(__name__)


class ReportLotLabel(models.AbstractModel):
    _inherit = 'report.stock.label_lot_template_view'

    def _get_report_values(self, docids, data):
        lots = self.env['stock.lot'].browse(docids)
        lot_list = []
        for lot in lots:
            purchase_orders = self.env['purchase.order'].browse(lot.mapped('purchase_order_ids.id'))
            _logger.info(f'Barcode purchase orders {purchase_orders}')
            po_data = purchase_orders[0] if purchase_orders else False
            _logger.info(f'Barcode purchase date {po_data}')
            stock_pickings = self.env['stock.picking'].browse(
                lot.mapped('stock_valuation_layer_ids.stock_move_id.picking_id.id')
            )
            _logger.info(f'Barcode purchase stock_pickings {stock_pickings}')
            picking_data = stock_pickings[0] if stock_pickings else False
            _logger.info(f'Barcode purchase picking_data {picking_data}')
            supplier_name = po_data.partner_id.name if po_data and po_data.partner_id else \
                (picking_data.partner_id.name if picking_data and picking_data.partner_id else '')
            _logger.info(f'Barcode purchase supplier_name {supplier_name}')
            document_date = format_date(self.env, po_data.date_order) if po_data and po_data.date_order else \
                (format_date(self.env,
                             picking_data.scheduled_date) if picking_data and picking_data.scheduled_date else '')
            _logger.info(f'Barcode purchase document_date {document_date}')
            po_number = po_data.name if po_data else ''
            _logger.info(f'Barcode purchase po_number {po_number}')
            lot_list.append({
                'display_name_markup': markupsafe.Markup(lot.product_id.display_name),
                'name': markupsafe.Markup(lot.name),
                'lot_record': lot,
                'document_date': document_date,
                'supplier': supplier_name,
                'po_number': po_number,
            })
            _logger.info(f'Barcode zpl list {lot_list}')
        return {
            'docs': lot_list,
        }
