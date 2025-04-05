{
    "name": "Stock Lot Report",
    "version": "18.0.1.0.6",
    "category": "Inventory/Inventory",
    "summary": "Updated the stock lot report",
    "description": "This module updates the stock lot report",
    "author": "Cybrosys Techno Solutions",
    "company": "Cybrosys Techno Solutions",
    "maintainer": "Cybrosys Techno Solutions",
    "website": "https://www.cybrosys.com",
    "depends": ["base_setup", "stock", "stock_barcode", "product"],
    "data": [
        "report/report_lot_barcode.xml",
        "views/stock_picking_views.xml",
        "views/product_label_layout_views.xml",
        "report/stock_lot_report.xml",
        "report/stock_lot_barcode_report.xml",
    ],
    'assets': {
            'web.assets_backend': [
                'custom_stock_lot/static/src/js/main.js',
                # 'stock_barcode_quality_control/static/src/**/*.xml',
            ],
        },

    "license": "AGPL-3",
    "installable": True,
    "auto_install": False,
    "application": False,
}
