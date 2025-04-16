export function openFilter(){
    console.log("openFIlter");

    const overlay = $("#overlay");
    const filterModal = $("#filterModal");

    overlay.show();
    filterModal.show(); 

    overlay.on("click", function() {
        filterModal.hide();
        overlay.hide();
    });

    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    document.getElementById("fromDate").value = formatDateToYMD(startOfMonth);
    document.getElementById("toDate").value = formatDateToYMD(endOfMonth);
    $(document).ready(function () {
        $(".accordion-header").off("click").on("click", function () {
          const content = $(this).next(".accordion-content");
      
          // 他を閉じたい場合はこの行追加 → $(".accordion-content").not(content).slideUp();
          content.slideToggle(200);
        });

        // 外食費チェックボックスに連動してオプションを表示/非表示
        $("#eatingOut").on("change", function() {
            console.log("外食費")
            if ($(this).is(":checked")) {
                $("#eatingOutOptions").slideDown();  // チェックされていれば表示
            } else {
                $("#eatingOutOptions").slideUp();  // チェックが外れれば非表示
                // チェックも外す（必要であれば）
                $("#eatingOutOptions input[type='checkbox']").prop("checked", false);
            }
        });

        $(".category-header").off("click").on("click", function () {
            const content = $(this).next(".category-content");
        
            // 他を閉じたい場合はこの行追加 → $(".accordion-content").not(content).slideUp();
            content.slideToggle(200);
          });

        $("#card").on("change", function() {
            if ($(this).is(":checked")) {
                $("#cardOptions").slideDown();  // チェックされていれば表示
            } else {
                $("#cardOptions").slideUp();  // チェックが外れれば非表示
                // チェックも外す（必要であれば）
                $("#cardOutOptions input[type='checkbox']").prop("checked", false);
            }
        });
        $("#bank").on("change", function() {
            if ($(this).is(":checked")) {
                $("#bankOptions").slideDown();  // チェックされていれば表示
            } else {
                $("#bankOptions").slideUp();  // チェックが外れれば非表示
                // チェックも外す（必要であれば）
                $("#bankOutOptions input[type='checkbox']").prop("checked", false);
            }
        });
    })
    
}

function formatDateToYMD(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

export function clearFilter() {
    document.getElementById("filterForm").reset();   
}

export function searchJsonData(jsonData){
    let newJsonData = [];
        let matched = false;
        let paymentMatched = false;
        //チェックした項目を取得
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
    
        const checkedCategory = Array.from(document.querySelectorAll('.check-item:checked'))
                              .map(cb => cb.value);
        const checkedPaymentItems = Array.from(document.querySelectorAll('.check-payment-item:checked'))
                              .map(cb => cb.value);
        
        const keyword = document.getElementById('freeWord').value;
        const keywords = keyword.split(/\s+/).filter(k => k !== "");
        
    
        jsonData.forEach(entry => {
            const entryDate = new Date(entry.date);
            const datePeriod = ((!fromDate || entryDate >= new Date(fromDate)) && (!toDate || entryDate <= new Date(toDate)));
            // エントリ内のすべての値を再帰的に文字列にして1つにまとめる関数
            const flattenValues = obj => {
                if (typeof obj === 'string' || typeof obj === 'number') return [String(obj)];
                if (Array.isArray(obj)) return obj.flatMap(flattenValues);
                if (typeof obj === 'object' && obj !== null) {
                    return Object.values(obj).flatMap(flattenValues);
                }
                return [];
            };
            
            const allValues = flattenValues(entry);
            const hasKeywords = keywords.every(kw =>
                allValues.some(val => val.toLowerCase().includes(kw.toLowerCase()))
            );
    
            checkedCategory.forEach(word => {
                matched = allValues.some(val => val.includes(word));
            });
    
            checkedPaymentItems.forEach(word => {
                paymentMatched = allValues.some(val => val.includes(word));
            });
    
            if((checkedCategory.length === 0 || matched) && datePeriod && (keywords.length === 0 || hasKeywords) && (checkedPaymentItems.length === 0 || paymentMatched)){
                newJsonData.push(entry);
            }
            console.log("checkedCategory.length : " + checkedCategory.length + "matched : " + matched);
            console.log(datePeriod);
            console.log((keywords.length === 0 || hasKeywords));
            console.log((checkedPaymentItems.length === 0 || paymentMatched));
            
        });
        return newJsonData;
}