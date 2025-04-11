
// セレクトボックス作成関数
export function createSelect(id, options, placeholder) {
    console.log(id);
    console.log(options);
    console.log(placeholder);
    const select = document.createElement("select");
    select.id = id;
    select.name = id;

    const defaultOption = document.createElement("option");
    defaultOption.text = `-- ${placeholder}を選択 --`;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);


    options.forEach(optionText => {
        const option = document.createElement("option");
        option.value = optionText;
        option.text = optionText;
        select.appendChild(option);
    });
    return select;
}

export function calculateTotalAmount() {
    let total = 0;
    $("input[name='price[]']").each(function () {
        const val = parseFloat($(this).val());
        if (!isNaN(val)) {
            total += val;
        }
    });
    $("#amount").val(total); // 合計をセット（例としてamountフィールドに）
}

export function sendData(entryId) {
    var date = $("#date").val();
    var category1 = $("#mainCategory").val();
    var category2 = $("#subCategory").val();
    var category3 = $("#mealDetail").val() === null ? "" :$("#mealDetail").val(); 
    var shop = $("#shop").val();
    let product = $("input[name='item[]']").map(function() {
        return $(this).val();
    }).get();
    let price = $("input[name='price[]']").map(function() {
        return $(this).val();
    }).get();
    var amount = $("#amount").val();
    var payment1 = $("#paymentCategory").val();

    var payment2 = $("#subPaymentCategory").val();

    var remarks = $("#remarks").val();

    // 入力チェック
    if (!date) {
        alert("日付を入力してください。");
        return;
    }
    console.log(category1);
    if (!category1) {
        alert("項目を選択してください。");
        return;
    }
    if (!payment1) {
        alert("支払い方法を選択してください。");
        return;
    }

    for (let i = 0; i < price.length; i++) {
        if (!price[i] || isNaN(price[i])) {
            alert("金額は数値で入力してください。");
            return;
        }
    }

    var existingId = typeof entryId === 'undefined' ?generateUniqueId():entryId;

    var newData = {
        id: existingId,
        date: date,
        category: {
            category1: category1,
            category2: category2,
            category3: category3,
        },
        shop: shop,
        product: product,
        price: price,
        amount: amount,
        payment: {
            payment1: payment1,
            payment2: payment2
        },
        remarks: remarks
    };

    console.log("送信するデータ:", newData);

    updateJSONData(newData);
    updateTable();
    alert("送信しました！");
    closePopup();
}
