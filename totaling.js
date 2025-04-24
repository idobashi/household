let myChart = null;
let flg = false;

// 対象月のデータを取得
function getDataByMonth(jsonData, year, month) {
  return jsonData.filter(item => {
    const date = new Date(item.date);
    return date.getFullYear() === year && date.getMonth() === (month - 1); // JSは0月始まり
  });
}


export function totalling(jsonData,currentDate,monthChangeFlg) {
    const tableView = document.getElementById("jsonTable"); // JSONテーブルエリア
    const chartView = document.getElementById("chartView");// グラフ描画エリア
    //let toggleButton = document.getElementById("changeTotalling");
    console.log(currentDate)
    const thisMonth = currentDate.getMonth() + 1; // 0〜11
    
    const thisYear = currentDate.getFullYear();
    let monthlyData = [];
 
    let chartVisible = false;
    console.log(thisMonth)

    monthlyData = getDataByMonth(jsonData, thisYear, thisMonth);
    console.log(monthlyData)

    // グラフ描画関数
    function renderChart(data) {
        const totals = {};
        data.forEach(item => {
            const cat = item.category.category1;
            const amt = parseFloat(item.amount);
            totals[cat] = (totals[cat] || 0) + amt;
        });

        const labels = Object.keys(totals);
        const amounts = Object.values(totals);
        const ctx = document.getElementById("categoryPieChart").getContext("2d");

        // すでにチャートが描画されている場合は破棄
        if (myChart) {
            console.log("monthChangeFlg : " + monthChangeFlg);
            if(monthChangeFlg){
                myChart.destroy();
            }else{
                return;
            }
        }
            
        // 新しいチャートを描画
        myChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: ["#f44336", "#2196f3", "#4caf50", "#ff9800", "#9c27b0"]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: "カテゴリ別 支出円グラフ"
                    }
                }
            }
        });
    }
    renderChart(monthlyData); // グラフを描画
}

export function changeTotalTable(jsonData,currentDate,monthChangeFlg){
    const chartView = document.getElementById("chartView");
    const tableView = document.getElementById("jsonTable");
    const paymentView = document.getElementById("paymentTable");
    totalling(jsonData,currentDate,monthChangeFlg);

    chartView.style.display = "block";
    tableView.style.display = "none";
    paymentView.style.display = "none";
}

