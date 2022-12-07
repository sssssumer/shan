import React from 'react';
import { YIUI,View } from 'yes-core';
import ChainDict from 'yes-comp-react-native-web/dist/components/ChainDict';
import { DictWrap } from 'yes';
import TriggerControlWrap from 'yes-comp-react-native-web/dist/components/TriggerControlWrap';

// class ERPDict extends React.PureComponent {
//     render() {
//         return (
//             <ChainDict  captionCol="caption" {...this.props} />
//         );
//     }
// }

const checkDict = async function (billform, comp, evalEnv) {
    let filter = null;
    const meta = comp.getMetaObj() || comp;
    if (meta.itemFilters) {
        const itemFilter = meta.itemFilters[meta.itemKey || ''];
        for (let i in itemFilter) {
            let cond = itemFilter[i].cond;
            if (cond && cond.length > 0) {
                let ret = await evalEnv(cond);
                if (ret === true) {
                    filter = itemFilter[i];
                    break;
                }
            } else {
                filter = itemFilter[i];
                break;
            }
        }
    }
    //取 filter值
    if (filter) {
        let filterVal;
        let paras = [];
        if (filter.filterVals !== null && filter.filterVals !== undefined && filter.filterVals.length > 0) {
            for (let j = 0, len = filter.filterVals.length; j < len; j++) {
                filterVal = filter.filterVals[j];
                switch (filterVal.type) {
                    case YIUI.FILTERVALUETYPE.CONST:
                        //paras += content;
                        paras.push(filterVal.refVal);
                        break;
                    case YIUI.FILTERVALUETYPE.FIELD:
                        //paras += form.eval(content, cxt, null);
                        // if (!cxt) {
                        //     cxt = new View.Context(billform.form);
                        // }
                        // paras.push(form.eval(filterVal.refVal, cxt, null));
                        // break;
                        paras.push(await evalEnv(filterVal.refVal));
                        break;
                    case YIUI.FILTERVALUETYPE.FORMULA:
                        // const obj =await billform.form.getUIProcess().evalFilter(comp.key, filterVal.refVal);
                        // paras.push(obj);
                        // break;
                        const obj = await billform.form.getUIProcess().evalFilter(evalEnv,comp.key, filterVal.refVal);
                        console.log(`${comp.key}.filter=${obj}`);
                        paras.push(obj);
                        break;
                }
            }
        }
        const dictFilter = {};
        dictFilter.itemKey = meta.itemKey;
        dictFilter.formKey = billform.form.formKey;
        dictFilter.sourceKey = comp.key;
        dictFilter.fieldKey = comp.key;
        dictFilter.filterIndex = filter.filterIndex;
        dictFilter.values = paras;
        dictFilter.dependency = filter.dependency;
        dictFilter.typeDefKey = filter.typeDefKey;
        return dictFilter;
    }
    return null;
};
export default DictWrap(TriggerControlWrap(ChainDict), checkDict);