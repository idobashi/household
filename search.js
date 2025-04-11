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
