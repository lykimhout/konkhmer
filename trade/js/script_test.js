/* Place your JavaScript in this file */

$(document).ready(function () {
    let maxid = 0;
    var OriginArrDataTrade = [];
    const sortASC = " ▲"; //alt + 30
    const sortDESC = " ▼"; // alt + 31
    const sortIDDesc = " ↕"; // alt + 18
    var isaddnewcoin = 0;
    // for loading json to Array visit this url (https://stackoverflow.com/questions/33328779/javascript-jquery-push-json-objects-into-array)
    //loaddata(2, 0, 0);
    // Let finish load data first then do another function

    loaddata(2, 0, 0).done(function () {
        groupByName(OriginArrDataTrade).done(function () {
        });
    });

    $('#dvwrap_tbl_history').on('click', '.btn_addcoin', function () {
        console.log("yes");
        if (isaddnewcoin === 0) {
            isaddnewcoin = 1;
            $("#dv_addcoin").fadeIn();
            if ($(this).attr('class') === 'btn_addcoin')
                $(this).text("-");
        } else {
            isaddnewcoin = 0;
            $("#dv_addcoin").fadeOut();
            if ($(this).attr('class') === 'btn_addcoin')
                $(this).text("+");
        }
    });
    $('#dvwrap_tbl_history').on('click', '.spn_theadname', function () {
        var tmpthis = ".spn_theadname";
        var tmpdatasort = $(this).attr("data-sort").toLowerCase();
        var tmpdataname = $(this).attr("data-name").toLowerCase();
        // change the icon and record sort condition        
        switch (tmpdatasort) {
            case "asc":
                switch (tmpdataname) {
                    case "coint_type":
                        loaddata(0, 1, 0);
                        $(tmpthis).attr("data-sort", "desc");
                        $(tmpthis).find('span.spn_sorticon').html(sortASC);
                        break;
                    default:
                }
                break;
            case "desc":
                switch (tmpdataname) {
                    case "coint_type":
                        loaddata(0, 2, 0);
                        $(tmpthis).attr("data-sort", "iddesc");
                        $(tmpthis).find('span.spn_sorticon').html(sortDESC);
                        break;
                    default:
                }
                break;
            default:
            switch (tmpdataname) {
                case "coint_type":
                    loaddata(2, 0, 0);
                    $(tmpthis).attr("data-sort", "asc");
                    $(tmpthis).find('span.spn_sorticon').html(sortIDDesc + " <span class='font_monospace font_size15em'>ID</span>");
                    break;
                default:
            }
        }
    });

    $("#btn_insert").click(function () {
        if (!conditionFormBeforeSave())
            return;
        var coinname = $("#txt_coinname").val();
        var orderdate = $("#txt_orderdate").val();
        var orderprice = $("#txt_orderprice").val();
        var orderamount = $("#txt_orderamount").val();
        var ordertotal = $("#txt_ordertotal").val();
        var orderbuysell = $("#cmbbuysell").val();
        var donetrade = 0;
        if (parseInt(orderbuysell) === 0)
            donetrade = 1;

        $.each(OriginArrDataTrade, function (i, item) {
            // store the max id
            if (parseInt(OriginArrDataTrade[i].id) > maxid) {
                maxid = parseInt(OriginArrDataTrade[i].id);
            }
        });
        maxid = maxid + 1;

        OriginArrDataTrade.unshift({
            'id': maxid, 'buysell': orderbuysell, 'done_trade': donetrade, "detail": {
                "coint_type": coinname,
                "order_date": orderdate,
                "order_price": orderprice,
                "order_amount": orderamount,
                "total": ordertotal
            }
        });
        // Save data
        saveData(OriginArrDataTrade);
    });
    $(".tbl_history").on('click', '.spnTradeOption', function () {
        $('.dropdown').hide();
        $(this).next('.dropdown').toggle();
    });
    $(".tbl_history").on('click', '.spnTradeOptionAction', function () {
        var tmpThis = $(this);
        var tmpOption = tmpThis.attr('data-option').toLowerCase();
        var tmpId = parseInt(tmpThis.attr('data-id'));
        var tmpName = tmpThis.attr('data-name');
        var tmpDate = tmpThis.attr('data-date');
        var tmpType = tmpThis.attr('data-type');
        var tmpAmount = tmpThis.attr('data-amount');

        if (parseInt(tmpType) === 0)
            tmpType = "Type: Sell";
        else
            tmpType = "Type: Buy";
        if (tmpAmount < 0)
            tmpAmount = " | Amount: <span class='classred'>" + tmpAmount + "</span>";
        else
            tmpAmount = " | Amount: <span class='classgreen'>" + tmpAmount + "</span>";

        var tmpContent = "ID: " + tmpId + " | Name: " + tmpName + " | Date: " + tmpDate + "<br/>" + tmpType + tmpAmount + "";
        var el = document.createElement("div");
        el.innerHTML = tmpContent;
        el.setAttribute('class', 'sweetalertbox_delete');
        var tmpQuestion = "Are you sure you want to delete this trade history?";
        var tmpWarning = "warning";
        if (tmpOption === "donetrade") {
            tmpQuestion = "Make the trade history to be done?";
            tmpWarning = "info";
        }

        //using swal function from sweetalert
        // https://sweetalert.js.org/
        swal({
            title: tmpQuestion,
            content: el,
            icon: tmpWarning,
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                // Save it!
                if (tmpOption === "donetrade") {
                    var foundIndex = OriginArrDataTrade.findIndex(index => parseInt(index.id) === tmpId);
                    OriginArrDataTrade[foundIndex].done_trade = "1";
                } else {
                    OriginArrDataTrade = OriginArrDataTrade.filter(function (elem) {
                        return parseInt(elem.id) !== tmpId;
                    });
                }
                // Save data
                saveData(OriginArrDataTrade, "updatedata");
            } else {
                //swal("Your imaginary file is safe!");
            }
        });
    });
    $('#cmbbuysell').on('change', function () {
        if (!conditionField($("#txt_orderamount").val(), $("#txt_orderprice").val()))
            return;
        var tmp = "";
        var orderbuysell = $(this).val();
        var tmpOrderTotal = $("#txt_ordertotal").val();
        if (parseInt(orderbuysell) === 1)
            tmp = "-";
        tmpOrderTotal = tmpOrderTotal.replace("-", "");
        $("#txt_ordertotal").val(tmp + tmpOrderTotal);
    });
    $("#txt_orderprice, #txt_orderamount").on('input', function (e) {
        var tmpInputPrice = $("#txt_orderprice").val();
        var tmpInputAmount = $("#txt_orderamount").val();
        if (conditionField(tmpInputPrice, tmpInputAmount)) {
            tmpInputPrice = parseFloat(tmpInputPrice);
            tmpInputAmount = parseFloat(tmpInputAmount);
            var orderbuysell = $("#cmbbuysell").val();
            var tmp = "";
            var tmpResult = (tmpInputAmount * tmpInputPrice).toFixed(4).replace(/\.0+$/, '');
            if (parseInt(orderbuysell) === 1)
                tmp = "-";
            $("#txt_ordertotal").val(tmp + tmpResult);
        } else
            $("#txt_ordertotal").val("");
    });
    // Dismiss form insert when click anywhere
    $('html').click((e) => {
        if (!$(e.target).is('.btn_addcoin') && !$(e.target).closest('#dv_addcoin').length) {
            $("#dv_addcoin").fadeOut();
            isaddnewcoin = 0;
            $('.btn_addcoin').text("+");
        }
        if (!$(e.target).is('.spnTradeOption') && !$(e.target).parents().is('.spnTradeOption')) {
            $('.dropdown').hide();
        }
    });
    function saveData(objArr, objOption = "") {
        if (objOption === "")
            objOption = "insertdata";
        $.ajax({
            type: 'POST',
            url: './model/insertjson.php',
            data: {action: objOption, data: objArr},
            dataType: "json",
            success: function (data) {

                $("#spn_msg").text(data["msg"]);
                $('#header').fadeIn('fast').delay(3000).fadeOut('fast');
                loaddata();
                $("#dv_addcoin").fadeOut();
                isaddnewcoin = 0;
                $('.btn_addcoin').text("+");
                clearcontrol();
            },
            error: function (objet, status, error) {
                console.log(objet);
                console.log(status);
                console.log(error);
                alert('Erreur');
            }
        });
    }
    function conditionFormBeforeSave() {
        var valid = true;
        $.each($("#frmAddCoin input.required"), function (index, value) {
            if (!$(value).val()) {
                valid = false;
            }
        });
        if (valid) {
        } else {
            alert("Please fill out the form");
        }
        return valid;
    }
    function loaddata(objSortId = 0, objSortName = 0, objSortDate = 0) {
        // doing async stuff
        var dfrd1 = $.Deferred(); // await when finish do other function
        var result = "", tmpAmountSell = 0, tmpAmountBuy = 0, tmpTotalSell = 0, tmpTotalBuy = 0;
        // clear clone table first        
        //$("#dv_clone_tbl_history").html("");
        // set visibilty none to original table header
        setVisibiltyOriginTblHistory('visible');
        $.getJSON("database/data_test.json", function (data) {
            /*
             [
             {
             "id":1,
             "detail":{
             "coint_type":"BNB",
             "order_date":"27 Jan 2025",
             "order_price":"639.8692",
             "order_amount":"0.1",
             "total":"63.98692"
             }
             
             },
             ]
             */
            // store database into array data;        
            OriginArrDataTrade = data;
            
            if (objSortId === 1) {
                data.sort(SortById); //data.sort(SortById).reverse() // desc
            } else if (objSortId === 2) {
                data.sort(SortById).reverse();
            } else if (objSortName === 1) {
                data.sort(SortByName);
            } else if (objSortName === 2) {
                data.sort(SortByName).reverse();
            } else if (objSortDate === 1) {
                data.sort(SortByDate);
            } else if (objSortDate === 2) {
                data.sort(SortByDate).reverse();
            }

            $.each(data, function (i, item) {
                /*			
                 //Example Data:
                 // alert(data[i].id);
                 // alert(data[i].detail["coint_type"]);									
                 */
                // store the max id
                if (parseInt(data[i].id) > maxid) {
                    maxid = parseInt(data[i].id);
                }
                var subtotal = "";
                if (parseInt(data[i].buysell) === 0) {
                    subtotal = "<span class='classgreen'>" + data[i].detail["total"] + "</span>";
                    tmpTotalSell = tmpTotalSell + parseFloat(data[i].detail["total"]);
                    tmpAmountSell = tmpAmountSell + parseFloat(data[i].detail["order_amount"]);
                } else {
                    subtotal = "<span class='classred'>" + data[i].detail["total"] + "</span>";
                    tmpTotalBuy = tmpTotalBuy + parseFloat(data[i].detail["total"]);
                    tmpAmountBuy = tmpAmountBuy + parseFloat(data[i].detail["order_amount"]);
                }

                result += "<tr>";

                result += "<td><span class='spncoinname' data-id='" + data[i].id + "'>" + data[i].detail["coint_type"] + "</span>";

                result += "<nav>";
                result += "<span class='spnTradeOption classpointer spnorderdate'>" + data[i].detail["order_date"];
                result += "<span class='spnTradeOption classpointer class3dot'>...</span></span>";
                var tmpDataAtt = " data-id='" + data[i].id + "' data-donetrade='" + data[i].done_trade + "' data-name='" + data[i].detail["coint_type"] + "' data-date='" + data[i].detail["order_date"] + "' data-type='" + data[i].buysell + "' data-amount='" + data[i].detail["total"] + "'";
                result += "<ul class='dropdown'>";
                if (parseInt(data[i].buysell) === 1) {
                    result += "<li><a href='#' data-option='donetrade' class='spnTradeOptionAction'" + tmpDataAtt + "><span class='classgreen'>&#x2713;</span> Done Trade</a></li>";
                }
                result += "<li><a href='#' data-option='delete' class='spnTradeOptionAction'" + tmpDataAtt + "><span class='spnxbutton'>&#x2715;</span> Delete</a></li>";

                result += "</ul>";
                result += "</nav>";
                result += "</td>";

                result += "<td>" + data[i].detail["order_price"] + "</td>";
                result += "<td>" + data[i].detail["order_amount"] + "</td>";
                result += "<td><span class='spnsubtotal'>" + subtotal + "</span></td>";
                result += "</tr>";
            });
            tmpAmountSell = (tmpAmountSell) - (tmpAmountBuy);
            // Convert to positive number 
            // ex: 5 - (-3) = 8 so we need to convert negative to positive 5 - 3 = 2 
            tmpTotalBuy = tmpTotalBuy * -1;
            tmpTotalSell = (tmpTotalSell) - (tmpTotalBuy);
            if (tmpAmountSell < 0)
                tmpAmountSell = "<span class='classred'>" + tmpAmountSell.toFixed(4).replace(/\.0+$/, '') + "</span>";
            else
                tmpAmountSell = "<span class='classgreen'>" + tmpAmountSell.toFixed(4).replace(/\.0+$/, '') + "</span>";
            if (tmpTotalSell < 0)
                tmpTotalSell = "<span class='spnsubtotal'><span class='classred'>" + tmpTotalSell.toFixed(4).replace(/\.0+$/, '') + "</span></span>";
            else
                tmpTotalSell = "<span class='spnsubtotal'><span class='classgreen'>" + tmpTotalSell.toFixed(4).replace(/\.0+$/, '') + "</span></span>";
            // Make last row about balance 
            var tmptopbottomrow = "";
            tmptopbottomrow += "<tr>";
            tmptopbottomrow += "<td colspan='2' class='classtextright'>Total Balance</td>";
            tmptopbottomrow += "<td>" + tmpAmountSell + "</td><td>" + tmpTotalSell + "</td>";
            tmptopbottomrow += "</tr>";

            $("#spn_balancecoin").html(tmpAmountSell);
            $("#spn_balance").html(tmpTotalSell);
            //jQuery delete all table rows except first
            $(".tbl_history").find("tr:gt(0)").remove();
            $(".tbl_history tbody").remove();
            $(".tbl_history").append("<tbody>" + result + "</tbody>");
            // clone table History and make header fixed
            cloneTblHistory(tmptopbottomrow);
            // set visibilty none to original table header
            setVisibiltyOriginTblHistory();
            // Async function
            dfrd1.resolve();
        }); // End ajax retrieve data        
        return dfrd1.promise();
    }

    function conditionField(obj, obj2) {
        if ((obj !== "" && $.isNumeric(obj)) && (obj2 !== "" && $.isNumeric(obj2)))
            return true;
        else
            return false;
    }
    function clearcontrol() {
        $("#txt_coinname").val("");
        $("#txt_orderdate").val("");
        $("#txt_orderprice").val("");
        $("#txt_orderamount").val("");
        $("#txt_ordertotal").val("");
    }
    //This will sort your array
    function SortByName(a, b) {
        var aName = a.detail.coint_type.toLowerCase();
        var bName = b.detail.coint_type.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    function SortById(a, b) {
        var aName = parseInt(a.id);
        var bName = parseInt(b.id);
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    function SortByDate(a, b) {
        var aName = a.detail.order_date.toLowerCase();
        var bName = b.detail.order_date.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    function cloneTblHistory(obj = "") {
        // remove table from div clone parent
        /*
         $("#dv_clone_tbl_history").html("");
         var tmpClone = $('.tbl_history').clone().find('tbody tr').remove().end();
         $("#dv_clone_tbl_history").html(tmpClone);
         $("#dv_clone_tbl_history table").removeClass("tbl_history");
         $("#dv_clone_tbl_history table").addClass("tbl_history_clone");
         $("#dv_clone_tbl_history table thead").css("visibility", "visible");        
         */
        var t1 = $('.tbl_history td:eq(0)').outerWidth();
        var t2 = $('.tbl_history td:eq(1)').outerWidth();
        var t3 = $('.tbl_history td:eq(2)').outerWidth();
        var t4 = $('.tbl_history td:eq(3)').outerWidth();

        $("#dv_clone_tbl_history table th:eq(0)").css('width', t1 + 'px');
        $("#dv_clone_tbl_history table th:eq(1)").css('width', t2 + 'px');
        $("#dv_clone_tbl_history table th:eq(2)").css('width', t3 + 'px');
        $("#dv_clone_tbl_history table th:eq(3)").css('width', t4 + 'px');

        // Clone Footer 
        $("#dv_clone_tbl_history_footer .tbl_history_clone_footer").html("");
        //tmpClone = $('.tbl_history').clone().find('tbody tr').remove().end();
        $("#dv_clone_tbl_history_footer .tbl_history_clone_footer").html(obj);
    }
    function setVisibiltyOriginTblHistory(obj = 'hidden') {
        //$("#dvwrap_tbl_history .tbl_history thead").css("display", obj);
        //$("#dvwrap_tbl_history .tbl_history tbody tr:first-child").css("visibility", obj);
        //$("#dvwrap_tbl_history .tbl_history tr:last").css("visibility", obj);
        //$("#dvwrap_tbl_history .tbl_history tbody tr:first-child").css("visibility", obj);
    }
    function groupByName(objArr) {
        var dfrd1 = $.Deferred();
        var helper = {};
        setTimeout(function () {
            var result = objArr.reduce(function (r, o) {
                if (parseInt(o.done_trade) === 0 && parseInt(o.buysell) === 1) {
                    var key = o.detail['coint_type'];
                    var amount = o.detail['order_amount'];
                    var total = o.detail['total'];

                    if (!helper[key]) {
                        //helper[key].detail['order_amount'] = 0; // Object.assign({}, o); // create a copy of o
                        //helper[key].detail['total'] = 0; // Object.assign({}, o); // create a copy of o
                        helper[key] = Object.assign({}, o); // create a copy of o
                        r.push(helper[key]);
                    } else {
                        helper[key].detail['order_amount'] = (parseFloat(helper[key].detail['order_amount']) + parseFloat(amount)).toFixed(4).replace(/\.0+$/, '');
                        ;
                        helper[key].detail['total'] = (parseFloat(helper[key].detail['total']) + parseFloat(total)).toFixed(4).replace(/\.0+$/, '');
                        ;
                    }
                }
                return r;
            }, []);
            var tmpTbl = '<table style="width:100%" class="tbl_current_trade">';
            tmpTbl += '<thead><tr><th colspan="3">Current Trading Information</th>';
            tmpTbl += '</tr></thead>';
            tmpTbl += '<tbody>';
            $.each(result, function (i, item) {
                //console.log(result[i].detail['coint_type']);
                //console.log(result[i].detail['order_amount']);
                //console.log(result[i].detail['total']);
                tmpTbl += '<tr>';
                tmpTbl += '<td>';
                tmpTbl += '<span class="spncoinname">' + result[i].detail['coint_type'] + '</span>';
                tmpTbl += '</td>';
                tmpTbl += '<td>';
                tmpTbl += '<span>' + result[i].detail['order_amount'] + '</span>';
                tmpTbl += '</td>';
                tmpTbl += '<td>';
                tmpTbl += '<span class="spnsubtotal"><span class="classred">' + result[i].detail['total'] + '</span></span>';
                tmpTbl += '</td>';
                tmpTbl += '</tr>';
            });
            tmpTbl += '</tbody></table>';
            $("#dv_tbl_current_trade").html(tmpTbl);
            // doing async stuff
            dfrd1.resolve();
        }, 500);
        return dfrd1.promise();
    }// End function group by name

});