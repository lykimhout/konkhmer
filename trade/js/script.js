/* Place your JavaScript in this file */

$(document).ready(function () {


    let maxid = 0;
    var OriginArrDataTrade = [];
    const sortASC = " ▲"; //alt + 30
    const sortDESC = " ▼"; // alt + 31

    // for loading json to Array visit this url (https://stackoverflow.com/questions/33328779/javascript-jquery-push-json-objects-into-array)
    loaddata(0, 1, 0);
    var isaddnewcoin = 0;
    $('#btn_addcoin').click(function () {
//$('#tbl_history tr:first').after('<tr><td></td><td></td><td></td><td></td><td></td></tr>');

        if (isaddnewcoin === 0) {
            isaddnewcoin = 1;
            $("#dv_addcoin").fadeIn();
            if ($(this).attr('id') === 'btn_addcoin')
                $(this).text("-");
        } else {
            isaddnewcoin = 0;
            $("#dv_addcoin").fadeOut();
            if ($(this).attr('id') === 'btn_addcoin')
                $(this).text("+");
        }
    });
    $(".spn_theadname").click(function () {
        var tmpthis = $(this);
        var tmpdatasort = $(this).attr("data-sort").toLowerCase();
        var tmpdataname = $(this).attr("data-name").toLowerCase();
        // change the icon and record sort condition
        switch (tmpdatasort) {
            case "asc":
                tmpthis.attr("data-sort", "desc");
                tmpthis.find('span.spn_sorticon').html(sortDESC);
                switch (tmpdataname) {
                    case "coint_type":
                        loaddata(0, 2, 0);
                        break;
                    default:
                }
                break;
            default:
                tmpthis.attr("data-sort", "asc");
                tmpthis.find('span.spn_sorticon').html(sortASC);
                switch (tmpdataname) {
                    case "coint_type":
                        loaddata(0, 1, 0);
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
        $.each(OriginArrDataTrade, function (i, item) {
            // store the max id
            if (parseInt(OriginArrDataTrade[i].id) > maxid) {
                maxid = parseInt(OriginArrDataTrade[i].id);
            }
        });
        maxid = maxid + 1;
        OriginArrDataTrade.unshift({'id': maxid, 'buysell': orderbuysell, "detail": {
                "coint_type": coinname,
                "order_date": orderdate,
                "order_price": orderprice,
                "order_amount": orderamount,
                "total": ordertotal
            }});
        // Save data
        saveData(OriginArrDataTrade);
    });
    $("#tbl_history").on('click', '.spnDeleteById', function () {

        var tmpThis = $(this);
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
        
        var tmpContent = "ID: " + tmpId + " | Name: " + tmpName + " | Date: " + tmpDate + "<br/>" + tmpType + tmpAmount+"";        
        var el = document.createElement("div");
        el.innerHTML = tmpContent;
        el.setAttribute('class', 'sweetalertbox_delete');
        
        //using swal function from sweetalert
        // https://sweetalert.js.org/
        swal({
            title: "Are you sure you want to delete this trade history?",
            content: el,
            icon: "warning",
            buttons: true,
            dangerMode: true,            
        }).then((willDelete) => {
            if (willDelete) {
                // Save it!
                OriginArrDataTrade = OriginArrDataTrade.filter(function (elem) {
                    return parseInt(elem.id) !== tmpId;
                });
                // Save data
                saveData(OriginArrDataTrade);
                swal("Record has been deleted!", {
                    icon: "success",
                });
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
        if (e.target.id == "btn_addcoin")
            return;
        //For descendants of div element being clicked
        if ($(e.target).closest('#dv_addcoin').length)
            return;
        $("#dv_addcoin").fadeOut();
        isaddnewcoin = 0;
        $('#btn_addcoin').text("+");
    });
    function saveData(objArr) {
        $.ajax({
            type: 'POST',
            url: './model/insertjson.php',
            data: {insertdata: objArr},
            dataType: "json",
            success: function (data) {

                $("#spn_msg").text(data["msg"]);
                $('#spn_msg').fadeIn('fast').delay(3000).fadeOut('fast');
                loaddata();
                $("#dv_addcoin").fadeOut();
                isaddnewcoin = 0;
                $('#btn_addcoin').text("+");
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
        var result = "", tmpAmountSell = 0, tmpAmountBuy = 0, tmpTotalSell = 0, tmpTotalBuy = 0;
        $.getJSON("database/data.json", function (data) {
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
                result += "<span class='spnorderdate spnDeleteById classpointer' data-id='" + data[i].id + "' data-name='" + data[i].detail["coint_type"] + "' data-date='" + data[i].detail["order_date"] + "' data-type='" + data[i].buysell + "' data-amount='" + data[i].detail["total"] + "'>" + data[i].detail["order_date"];
                result += " <span class='spnDeleteById spnxbutton classpointer' data-id='" + data[i].id + "' data-name='" + data[i].detail["coint_type"] + "' data-date='" + data[i].detail["order_date"] + "' data-type='" + data[i].buysell + "' data-amount='" + data[i].detail["total"] + "'>&#x2715;</span></span></td>";
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
            result += "<tr>";
            result += "<td colspan='2' class='classtextright'>Total Balance</td>";
            result += "<td>" + tmpAmountSell + "</td><td>" + tmpTotalSell + "</td>";
            result += "</tr>";
            //jQuery delete all table rows except first
            $("#tbl_history").find("tr:gt(0)").remove();
            $("#tbl_history").append(result);
        });
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


});