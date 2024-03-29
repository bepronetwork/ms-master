const fromPeriodicityToDates = ({periodicity='monthly'}) =>{
    var ret = {};

    switch(new String(periodicity).toLowerCase().trim()){
        case 'daily' : {
            ret = {
                from : getLastDaily(),
                to : new Date() // Today
            };
            break;
        };
        case 'weekly' : {
            ret = {
                from : getLastWeek(),
                to : new Date() // Today
            };
            break;
        };
        case 'monthly' : {
            ret = {
                from : getLastMonth(),
                to : new Date() // Today
            };
            break;
        };
        case 'all' : {
            ret = {};
            break;
        };
        default : {
            ret = {};
            break;
        }
    }

    return ret;
}

function getLastDaily() {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
}

function getLastWeek() {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
}

function getLastMonth() {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
}


export {
    fromPeriodicityToDates
}

export default function addYYYYMMDD() {
    Date.prototype.yyyymmdd = function() {
        var mm = this.getMonth() + 1;
        var dd = this.getDate();
        return [
            this.getFullYear(),
            (mm>9 ? '' : '0') +"-"+ mm,
            (dd>9 ? '' : '0') +"-"+ dd
        ].join('');
    };
}