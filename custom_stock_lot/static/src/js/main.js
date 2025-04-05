/** @odoo-module **/
import MainComponent from "@stock_barcode/components/main";
import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
import { useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import BarcodePickingModel from '@stock_barcode/models/barcode_picking_model';
import { markup } from '@odoo/owl';

patch(MainComponent.prototype, {
    setup() {
        super.setup();
        this.state = useState({ ...this.state, displayByProduct: false });
        this.orm = useService("orm");
        this.action = useService("action");
        this.notification = useService("notification");
    },

    async validate(ev) {
        ev.stopPropagation();

        try {
            // Get all product IDs from the current picking
            const moveLines = await this.orm.searchRead(
                'stock.move.line',
                [["picking_id", "=", this.resId]],
                ["product_id"]
            );

            if (!moveLines.length) {
                this.notification.add(_t("No products found in this transfer"), { type: "warning" });
                return;
            }
            const productIds = [];
            const productLineVals = [];

            // Create product line commands for the wizard
            moveLines.forEach(line => {
                const productId = Array.isArray(line.product_id) ? line.product_id[0] : line.product_id;
                if (productId && !productIds.includes(productId)) {
                    productIds.push(productId);
                    productLineVals.push([0, 0, {
                        product_id: productId,
                    }]);
                }
            });
            console.log("ggggggg", productIds)
            console.log("jjjjjjj", productLineVals)

            // Create the product.label.layout record - note we're using call() instead of create()
            const recordId = await this.orm.call(
                "product.label.layout",
                "create",
                [{
                    product_line_ids: productLineVals,
                }]
            );
            await this.orm.write("product.label.layout", [recordId], { product_ids: productIds, move_quantity: 'custom_per_product', is_validate: 'true' });

            // Open the wizard form
            await this.action.doAction({
                name: _t("Product Labels"),
                type: "ir.actions.act_window",
                res_model: "product.label.layout",
                res_id: recordId,
                views: [[false, "form"]],
                view_mode: "form",
                target: "new",
            });

        } catch (error) {
            console.error("Error in validate:", error);
            this.notification.add(_t("Error opening label wizard: ") + error.message, { type: "danger" });
        }
    }
});

//patch(MainComponent.prototype, {
//    setup() {
//        super.setup();
//        this.state = useState({ ...this.state, displayByProduct: false });
//        this.orm = useService("orm");
//    },
//    async validate(ev) {
//    ev.stopPropagation();
//
//    console.log("fffffffffffff", this)
//
//        const products = await this.orm.searchRead(
//            'stock.move.line',
//            [["picking_id", "=", this.resId]],["product_id"]
//        );
////        product.label.layout.line
//        console.log("jjjjjjjjjjj", products)
//        const productLineVals = products.map((prod) => {
//        console.log("ggggggggggggg", prod)
//            return [0, 0, {
//                product_id: prod.product_id[0],
//            }];
//        });
//        console.log("productLineCommands", productLineVals)
//
//        const [recordId] = await this.orm.call("product.label.layout", "create", [{
//            product_line_ids: productLineVals,
//        }]);
//
//        console.log("hhhhhhhhhh", [recordId])
//
//
//
//
//
//
//        const rec = await this.env.model.validate();
//            await this.action.doAction({
//            name: _t("Product Barcode Quantity"),
//            type: "ir.actions.act_window",
//            res_model: "product.label.layout",
//            res_id: recordId,
//            views: [[false, "form"]],
//            view_mode: "form",
//            target: "new",
////            context: {
////                default_product_line_ids: productLineCommands
////            },
//        });
//        console.log("kkkkkkkkkkk", rec)
////        console.log(ddddddddddddddd)
//    }
//    });

patch(BarcodePickingModel.prototype, {
    async _closeValidate(ev) {
        const record = await this.orm.read(this.resModel, [this.record.id], ["state"]);
        if (record[0].state === 'done') {
            // Checks if the picking generated a backorder. Updates the picking's data if it's the case.

            const backorders = await this.orm.searchRead(
                this.backorderModel,
                this.backordersDomain,
                ["display_name", "id"]);
            const buttons = backorders.map(bo => {
                const additionalContext = { active_id: bo.id };
                return {
                    name: bo.display_name,
                    onClick: () => {
                        this.action.doAction(this.actionName, { additionalContext });
                    },
                };
            });
            if (backorders.length) {
                const phrase = backorders.length === 1 ?
                    _t("Following backorder was created:") :
                    _t("Following backorders were created:");
                this.validateMessage = `<div>
                    <p>${escape(this.validateMessage)}<br>${escape(phrase)}</p>
                </div>`;
                this.validateMessage = markup(this.validateMessage);
            }
            this.notification(this.validateMessage, { type: "success", buttons });
//            this.trigger('history-back');
        }
    }
});
