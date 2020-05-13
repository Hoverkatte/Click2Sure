var accounts = [];
var tempID;

$(document).ready(function () {

    /*
        On document ready an ajax call would be made to a backend file to retrieve the data for the account from the database and 'accounts' would be populated with the data in JSON format.
    */

    /* 
        I realise my listener might look strange because I attach it to the body with a selector, this is because I'm used to writing code for dynamically inserted DOM elements.
        These type of listeners can be attached to a parent element, but they can also be removed with a simple 'off' function using the same selector on the parent.
    */

    $("body").on("click", ".new-account-btn", function () {

        openModal("new-account");

    });

    $("body").on("click", ".modal-close-btn, .modal-overlay", function () {

        closeModals();

    });

    $("body").on("click", ".add-account-btn", function () {

        var t = $(this).attr("data-t");
        var id = makeID(8);
        var balance = 0.00;

        if (t == "savings") {

            balance = 1000.00;

        }

        var html = "<div class='table-struct-row' id='" + id + "' data-t='" + t + "'>";
        html += "<div class='table-row-side-btn view-btn'><i class='fa fa-eye inner-center'></i></div>";

        if (t == "cheque") {

            html += "<div class='table-struct-td'>Current</div>";

        } else {

            html += "<div class='table-struct-td'>Savings</div>";

        }

        html += "<div class='table-struct-td'>" + id + "</div>";
        html += "<div class='table-struct-td'>R" + balance + "</div>";
        html += "<div class='table-struct-td'><div class='btn withdraw-btn'>WITHDRAW</div></div>";
        html += "<div class='table-struct-td'><div class='btn deposit-btn'>DEPOSIT</div></div>";
        html += "</div > ";

        /*
            Ajax call to server with new account data, on success the following would execute;
        */

        accounts.push({ "id": id, "type": t, "balance": balance, "history": [{ "date": getDate(), "balance": balance, "type": "Created", "ammount": balance }] });

        $(".main-ctn").append(html);

        closeModals();

    });

    $(".main-ctn").on("click", ".withdraw-btn, .deposit-btn, .view-btn", function () {

        tempID = $(this).parents(".table-struct-row").attr("id");

    });

    $(".main-ctn").on("click", ".withdraw-btn", function () {

        openModal("withdraw");

    });

    $(".main-ctn").on("click", ".deposit-btn", function () {

        openModal("deposit");

    });

    $(".main-ctn").on("click", ".view-btn", function () {

        $(".modal-box[data-n='history'] > .inner-ctn").html("");

        for (var i = 0; i < accounts.length; i++) {

            if (accounts[i]["id"] == tempID) {

                var html = "<div class='table-struct'>";
                html += "<div class='table-struct-head'>";
                html += "<div class='table-struct-th'>TYPE</div>";
                html += "<div class='table-struct-th'>AMMOUNT</div>";
                html += "<div class='table-struct-th'>BALANCE</div>";
                html += "<div class='table-struct-th'>DATE</div>";
                html += "</div>";
                html += "<div class='table-struct-body height-scroll'></div>";
                html += "</div>";

                $(".modal-box[data-n='history'] > .inner-ctn").append(html);

                for (var j = 0; j < accounts[i]["history"].length; j++) {

                    var html = "<div class='table-struct-row'>";
                    html += "<div class='table-struct-td'>" + accounts[i]["history"][j]["type"] + "</div>";
                    html += "<div class='table-struct-td'>R" + accounts[i]["history"][j]["ammount"] + "</div>";
                    html += "<div class='table-struct-td'>R" + accounts[i]["history"][j]["balance"] + "</div>";
                    html += "<div class='table-struct-td'>" + accounts[i]["history"][j]["date"] + "</div>";
                    html += "</div>";

                    $(".modal-box[data-n='history'] > .inner-ctn .table-struct-body").append(html);

                }

                break;

            }

        }

        openModal("history");

    });

    $("body").on("click", ".withdraw-final-btn", function () {

        var ammount = parseFloat($(".withdraw-input").val());
        var balance = 0.00;
        var type = "";
        var history;

        if (ammount == 0) {

            alert("Please enter ammount to proceed");

        } else {

            for (var i = 0; i < accounts.length; i++) {

                if (accounts[i]["id"] == tempID) {

                    balance = parseFloat(accounts[i]["balance"]);
                    type = accounts[i]["type"];
                    history = accounts[i]["history"];

                    break;

                }

            }

            if (type != "") {

                var newBalance = parseFloat(balance - ammount);

                switch (type) {

                    case "cheque":

                        if (newBalance > -100000) {

                            /*
                                Ajax call to server with withdrawal data with security key compromised of account id, on success the following would run
                            */

                            accounts[i]["balance"] = newBalance;
                            history.push({ "date": getDate(), "balance": newBalance, "type": "Withdrawal", "ammount": ammount });
                            accounts[i]["history"] = history;

                            $("#" + tempID + ".table-struct-row > .table-struct-td:nth-child(4)").text("R" + newBalance.toFixed(2));

                            closeModals();

                        } else {

                            alert("Withdrawal ammount exceeds overdraft!");

                        }

                        break;

                    case "savings":

                        var newBalance = balance - ammount;

                        if (newBalance > 1000) {

                            /*
                                Ajax call to server with withdrawal data with security key compromised of account id, on success the following would run
                            */

                            accounts[i]["balance"] = newBalance;
                            history.push({ "date": getDate(), "balance": newBalance, "type": "Withdrawal", "ammount": ammount });
                            accounts[i]["history"] = history;

                            $("#" + tempID + ".table-struct-row > .table-struct-td:nth-child(4)").text("R" + newBalance.toFixed(2));

                            closeModals();

                        } else {

                            alert("Insufficient funds for withdrawal");

                        }

                        break;

                }

            } else {

                alert("Error with account, please contact admin");

            }

        }

    });

    $("body").on("click", ".deposit-final-btn", function () {

        var ammount = parseFloat($(".deposit-input").val());
        var balance = 0.00;
        var type = "";
        var history;

        if (ammount == 0) {

            alert("Please enter ammount to proceed");

        } else {

            for (var i = 0; i < accounts.length; i++) {

                if (accounts[i]["id"] == tempID) {

                    balance = parseFloat(accounts[i]["balance"]);
                    type = accounts[i]["type"];
                    history = accounts[i]["history"];

                    break;

                }

            }

            if (type != "") {

                var newBalance = parseFloat(balance + ammount);

                /*
                    Ajax call to server with deposit data with security key compromised of account id, on success the following would run
                */

                accounts[i]["balance"] = newBalance;
                history.push({ "date": getDate(), "balance": newBalance, "type": "Deposit", "ammount": ammount });
                accounts[i]["history"] = history;

                $("#" + tempID + ".table-struct-row > .table-struct-td:nth-child(4)").text("R" + newBalance.toFixed(2));

                closeModals();

            } else {

                alert("Error with account, please contact admin");

            }

        }

    });

});

function openModal(n) {

    closeModals();

    $(".modal-overlay").show();
    $(".modal-box[data-n='" + n + "']").show();

}

function closeModals() {

    $(".modal-overlay").hide();
    $(".modal-box").hide();

}

/*--- found these functions from stackoverflow and tweaked a bit ---*/

function makeID(length) {

    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {

        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    }

    for (var i = 0; i < accounts.length; i++) {

        if (accounts[i]["id"] == result) {

            makeID(length);

        }

    }

    return result;

}

function getDate() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();

    return d.getFullYear() + "/" + (month < 10 ? "0" : "") + month + "/" + (day < 10 ? "0" : "") + day;

}