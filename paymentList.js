export function paymentListTable(jsonData,currentDate,paymentInfo){
    const thisMonth = currentDate.getMonth() + 1; // 0〜11
    const thisYear = currentDate.getFullYear();
    const paymenView = document.getElementById("paymentTable");

    

    let table = `<table class="payment-table"><tr>
        <th>支払い</th>
        <th>利用期間</th>
        <th>支払い日</th>
        <th>金額</th>
    </tr>`;

    paymentInfo.forEach(entry => {
        
        const payment = entry.payment;
        let period;
        let paymentDate;
        let endDate;

        const startDate = new Date(thisYear, thisMonth - 1, Number(entry.periodStart));

        if (entry.periodEnd === "末日") {
            // 月の最終日
            endDate = new Date(thisYear, thisMonth, 0); // 次月0日は前月末日
        } else {
            endDate = new Date(thisYear, thisMonth - 1, Number(entry.periodEnd));
        }
        
        let sd = new Date(startDate);
        let formatteStartDate = ("0" + (sd.getMonth() + 1)).slice(-2) + "/" + ("0" + sd.getDate()).slice(-2);
        let ed = new Date(endDate);
        let formatteEndDate = ("0" + (ed.getMonth() + 1)).slice(-2) + "/" + ("0" + ed.getDate()).slice(-2);

        const amount = getAmount(jsonData, payment, entry.periodStart,entry.periodEnd,thisYear, thisMonth);
        paymentDate = (payment === "現金" || payment === "りそな銀行")?"-":paymentDate = getPaymentDate(thisYear,thisMonth);
        period = `${formatteStartDate}～${formatteEndDate}`;
        

        table += `<tr>
            <td>${payment}</td>    
            <td>${period}</td>
            <td>${paymentDate}</td>
            <td>${amount}</td>
        </tr>`;
    });

    table += "</table>";
    document.getElementById("paymentTable").innerHTML = table;
}

function getPaymentDate(year, month) {
    // 支払月は「締め月の翌月」
    let payYear = month === 12 ? year + 1 : year;
    let payMonth = month === 12 ? 1 : month + 1;

    // 27日を基準とする
    let paymentDate = new Date(payYear, payMonth - 1, 27);
    console.log("paymentDate : " + paymentDate);

    // 土曜なら29日、日曜なら28日 or それ以上にする（翌営業日）
    while (paymentDate.getDay() === 0 || paymentDate.getDay() === 6) {
        paymentDate.setDate(paymentDate.getDate() + 1);
    }

    const mm = String(paymentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(paymentDate.getDate()).padStart(2, '0');
    const localDate = `${mm}/${dd}`;
    // フォーマットして返す（例: 2025-05-27）
    return localDate;
}

function getAmount(jsonData, paymentName, periodStart, periodEnd, year, month) {
    // 期間の開始・終了日を作成
    const startDate = new Date(year, month - 1, Number(periodStart));
    let endDate;

    if (periodEnd === "末日") {
        // 月の最終日
        endDate = new Date(year, month, 0); // 次月0日は前月末日
    } else {
        endDate = new Date(year, month - 1, Number(periodEnd));
    }

    // 金額合計を計算
    return jsonData
        .filter(entry => {
            const date = new Date(entry.date);
            const isInRange = date >= startDate && date <= endDate;
            const isPaymentMatch =
                entry.payment.payment1 === paymentName || entry.payment.payment2 === paymentName;

            return isInRange && isPaymentMatch;
        })
        .reduce((sum, entry) => sum + Number(entry.amount), 0);
}

export function createPaymentTable(jsonData,currentDate,paymentInfo){

    const tableView = document.getElementById("jsonTable"); // JSONテーブルエリア
    const chartView = document.getElementById("chartView");// グラフ描画エリア
    const paymenView = document.getElementById("paymentTable");

    paymentListTable(jsonData,currentDate,paymentInfo);
    chartView.style.display = "none";
    tableView.style.display = "none";
    paymenView.style.display = "block";

}