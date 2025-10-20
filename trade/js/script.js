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

    });

    $('#dvwrap_tbl_history').on('click', '.btn_addcoin', function () {
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
                    case "coin_type":
                        loaddata(0, 1, 0);
                        $(tmpthis).attr("data-sort", "desc");
                        $(tmpthis).find('span.spn_sorticon').html(sortASC);
                        break;
                    default:
                }
                break;
            case "desc":
                switch (tmpdataname) {
                    case "coin_type":
                        loaddata(0, 2, 0);
                        $(tmpthis).attr("data-sort", "iddesc");
                        $(tmpthis).find('span.spn_sorticon').html(sortDESC);
                        break;
                    default:
                }
                break;
            default:
            switch (tmpdataname) {
                case "coin_type":
                    loaddata(2, 0, 0);
                    $(tmpthis).attr("data-sort", "asc");
                    $(tmpthis).find('span.spn_sorticon').html(sortIDDesc + " <span class='font_monospace font_size15em'>ID</span>");
                    break;
                default:
            }
        }
    });
    $('#dv_tbl_current_trade').on('click', '.trviewdetail', function () {
        //$('.tr_detail').hide();
        //$(this).next('tr.tr_detail').toggle();
        $(this).closest('tr').next().toggle();
        /*
         e.preventDefault();
         var elem = $(this).next('.tr_detail');
         elem.toggle('slow');*/
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
                "coin_type": coinname,
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
                    /*
                     var foundIndex = OriginArrDataTrade.findIndex(index => parseInt(index.id) === tmpId);
                     // when found index then update
                     if(foundIndex>=0) OriginArrDataTrade[foundIndex].done_trade = "1";
                     */
                    OriginArrDataTrade.findIndex(function (key, i) {
                        if (parseInt(key.id) === tmpId) {
                            OriginArrDataTrade[i].done_trade = '1';
                            // Save data
                            saveData(OriginArrDataTrade, "updatedata");

                            return true;
                        }
                    });
                } else if (tmpOption === "delete") {
                    OriginArrDataTrade = OriginArrDataTrade.filter(function (elem) {
                        return parseInt(elem.id) !== tmpId;
                    });
                    // Save data
                    saveData(OriginArrDataTrade, "updatedata");
                }
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
        setTimeout(function () {
            $.getJSON("database/data.json", function (data) {
                /*
                 [{"id":1,"detail":{"coin_type":"BNB","order_date":"27 Jan 2025","order_price":"639.8692","order_amount":"0.1","total":"63.98692"}},]
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
                     // alert(data[i].detail["coin_type"]);									
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

                    result += "<td><span class='spncoinname' data-id='" + data[i].id + "'>" + data[i].detail["coin_type"] + "</span>";

                    result += "<nav>";
                    result += "<span class='spnTradeOption classpointer spnorderdate'>" + data[i].detail["order_date"];
                    result += "<span class='spnTradeOption classpointer class3dot'>...</span></span>";
                    var tmpDataAtt = " data-id='" + data[i].id + "' data-donetrade='" + data[i].done_trade + "' data-name='" + data[i].detail["coin_type"] + "' data-date='" + data[i].detail["order_date"] + "' data-type='" + data[i].buysell + "' data-amount='" + data[i].detail["total"] + "'";
                    result += "<ul class='dropdown'>";
                    if (parseInt(data[i].buysell) === 1) {
                        result += "<li><a href='#' data-option='donetrade' class='spnTradeOptionAction'" + tmpDataAtt + "><span class='classgreen'>&#x2713;</span> Done Trade</a></li>";
                    }
                    result += "<li><a href='#' data-option='delete' class='spnTradeOptionAction'" + tmpDataAtt + "><span class='spnxbutton'>&#x2715;</span> Delete</a></li>";

                    result += "</ul>";
                    result += "</nav>";
                    result += "</td>";

                    result += "<td>" + formatNum(data[i].detail["order_price"]) + "</td>";
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
                    tmpAmountSell = "<span class='classred'>" + formatNum(tmpAmountSell.toFixed(4).replace(/\.0+$/, '')) + "</span>";
                else
                    tmpAmountSell = "<span class='classgreen'>" + formatNum(tmpAmountSell.toFixed(4).replace(/\.0+$/, '')) + "</span>";
                if (tmpTotalSell < 0)
                    tmpTotalSell = "<span class='spnsubtotal'><span class='classred'>" + formatNum(tmpTotalSell.toFixed(4).replace(/\.0+$/, '')) + "</span></span>";
                else
                    tmpTotalSell = "<span class='spnsubtotal'><span class='classgreen'>" + formatNum(tmpTotalSell.toFixed(4).replace(/\.0+$/, '')) + "</span></span>";
                // Make last row about balance 
                var tmptopbottomrow = "";
                tmptopbottomrow += "<tr>";
                tmptopbottomrow += "<td colspan='2' class='classtextright'>Total Balance</td>";
                tmptopbottomrow += "<td>" + formatNum(tmpAmountSell) + "</td><td>" + formatNum(tmpTotalSell) + "</td>";
                tmptopbottomrow += "</tr>";

                $("#spn_balancecoin").html(tmpAmountSell);
                $("#spn_balance").html(tmpTotalSell);
                //jQuery delete all table rows except first
                $(".tbl_history").find("tr:gt(0)").remove();
                $(".tbl_history tbody").remove();
                $(".tbl_history").append("<tbody>" + result + "</tbody>");
                // clone table History and make header fixed
                cloneTblHistory(tmptopbottomrow);
                // Retreive current trading coin
                groupByName(data);
                // Async function
                dfrd1.resolve();
            }); // End ajax retrieve data            
        }, 500); // End timer
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
        var aName = a.detail.coin_type.toLowerCase();
        var bName = b.detail.coin_type.toLowerCase();
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

    function groupByName(objArr) {
        var dfrd2 = $.Deferred();
        setTimeout(function () {
            var result = [];
            var resultDetail = [];
            $.each(objArr, function (i, item) {
                if (parseInt(item.buysell) == 1 && parseInt(item.done_trade) == 0) {
                    var tmpDataId = item.id;
                    console.log(item.detail['coin_type']+" - coin type \n");
                    var tmpDataName = item.detail['coin_type'].toUpperCase();
                    var tmpDataOrderPrice = parseFloat(item.detail['order_price']);
                    var tmpDataAmount = parseFloat(item.detail['order_amount']);
                    var tmpDataTotal = parseFloat(item.detail['total']);

                    var findIndex = result.findIndex(function (key, ind) {

                        var keyTmpName = key.coin_type.toUpperCase();
                        if (keyTmpName === tmpDataName) {
                            // Updade amount sum up
                            result[ind].order_amount = (parseFloat(result[ind].order_amount) + tmpDataAmount).toFixed(4).replace(/\.0+$/, '');
                            result[ind].total = (parseFloat(result[ind].total) + tmpDataTotal).toFixed(4).replace(/\.0+$/, '');

                            resultDetail.push({'id': tmpDataId, 'coin_type': tmpDataName, 'order_price': tmpDataOrderPrice, 'order_amount': tmpDataAmount, 'total': tmpDataTotal});

                            return true;
                        }
                    });

                    if (findIndex < 0) {
                        result.push({'id': tmpDataId,
                            'coin_type': tmpDataName,
                            'order_amount': tmpDataAmount,
                            'total': tmpDataTotal});

                        resultDetail.push({'id': tmpDataId, 'coin_type': tmpDataName, 'order_price': tmpDataOrderPrice, 'order_amount': tmpDataAmount, 'total': tmpDataTotal});
                    }
                }
            });
            var tmpTbl = '<table style="width:100%" class="tbl_current_trade">';
            tmpTbl += '<thead><tr><th colspan="3">Current Trading Information</th>';
            tmpTbl += '</tr></thead>';
            tmpTbl += '<tbody>';
            $.each(result, function (i, item) {
                var tmpId = parseInt(item.id);
                var tmpName = item.coin_type.toUpperCase();
                tmpTbl += '<tr class="trviewdetail">';
                tmpTbl += '<td>';
                tmpTbl += '<span class="spncoinname">' + tmpName + '</span>';
                tmpTbl += '</td>';
                tmpTbl += '<td>';
                tmpTbl += '<span>' + formatNum(item.order_amount) + '</span>';
                tmpTbl += '</td>';
                tmpTbl += '<td>';
                tmpTbl += '<span class="spnsubtotal"><span class="classred">' + formatNum(item.total) + '</span></span>';
                tmpTbl += '</td>';
                tmpTbl += '</tr>';
                var tmpDetail = "";
                tmpDetail += "<tr class='tr_detail' style='display:none'>";
                tmpDetail += "<td colspan='3'>";
                tmpDetail += "<table class='tbl_current_trade_detail'><thead><tr>";
                tmpDetail += "<th>Detail</th><th><span>Order Price</span></th>";
                tmpDetail += "<th><span>Amount</span></th>";
                tmpDetail += "<th><span>Total</span></th>";
                tmpDetail += "</tr></thead>";
                tmpDetail += "<tbody>";
                var foundDetail = false;
                $.each(resultDetail, function (i2, item2) {
                    var tmpIdDetail = parseInt(item2.id);
                    var tmpNameDetail = item2.coin_type.toUpperCase();
                    if (tmpNameDetail === tmpName) {
                        tmpDetail += "<tr><td style='border-right:1px solid #ccc;width:70px'></td><td>" + formatNum(item2.order_price) + "</td>";
                        tmpDetail += "<td>" + formatNum(item2.order_amount) + "</td>";
                        tmpDetail += "<td><span class='spnsubtotal'>" + formatNum(item2.total) + "</span></td>";
                        foundDetail = true;
                    }
                });
                tmpDetail += "</tr>";
                tmpDetail += "</tbody></table>";
                if (foundDetail)
                    tmpTbl += tmpDetail;
            });
            tmpTbl += '</tbody></table>';
            $("#dv_tbl_current_trade").html(tmpTbl);
            // doing async stuff
            dfrd2.resolve();
        }, 700);
        return dfrd2.promise();
    }// End function group by name


    function formatNum(n) {
        var splits = n.toString().split(".");
        const numSplit = splits[0];
        const decimalSplit = splits[1];
        const thousands = /\B(?=(\d{3})+(?!\d))/g;
        return numSplit.replace(thousands, ",") + (decimalSplit ? "." + decimalSplit : "");
    }
});
