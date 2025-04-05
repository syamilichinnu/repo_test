/** @odoo-module **/
import MainComponent from "@stock_barcode/components/main";

import { useService } from "@web/core/utils/hooks";

import { patch } from "@web/core/utils/patch";
import { useState } from "@odoo/owl";

patch(MainComponent.prototype, {
    setup() {
        super.setup();
        this.state = useState({ ...this.state, displayByProduct: false });
        this.orm = useService("orm");
        console.log('hoiiiiiiiiiiiiiiissssssssi', this)
    },



    });




///** @odoo-module **/
//
//import { _t } from "@web/core/l10n/translation";
//import MainComponent from '@stock_barcode/components/main';
//import { patch } from "@web/core/utils/patch";
//
//patch(MainComponent.prototype, {
//    get hasQualityChecksTodo() {
//        return this.env.model.record && this.env.model.record.quality_check_todo;
//    },
//
//    async checkQuality(ev) {
//        ev.stopPropagation();
//        await this.env.model.save();
//        const res = await this.orm.call(
x//            this.env.model.openQualityChecksMethod,
//            [[this.resId]]
//        );
//        if (typeof res === 'object' && res !== null) {
//            return this.action.doAction(res, {
//                onClose: this._onRefreshState.bind(this, { recordId: this.resId }),
//            });
//        } else {
//            this.notification.add(_t("All the quality checks have been done"));
//        }
//    },
//
//    async onDemandQualityCheck() {
//        await this.env.model.save();
//        const res = await this.orm.call(this.resModel, "action_open_on_demand_quality_check",
//            [[this.resId]]
//        );
//        if (typeof res === 'object' && res !== null) {
//            return this.action.doAction(res, {
//                onClose: this._onRefreshState.bind(this, { recordId: this.resId }),
//            });
//        }
//    }
//});
