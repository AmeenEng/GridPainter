// استدعاء عناصر HTML التي سيتم التفاعل معها
let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

// كائن لتخزين الأحداث بناءً على نوع الجهاز (لمس أو ماوس)
let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend"
    }
};

let deviceType = ""; // لتحديد ما إذا كان الجهاز يدعم اللمس أو الماوس
let draw = false;    // لتحديد ما إذا كان المستخدم في وضع الرسم
let erase = false;   // لتحديد ما إذا كان المستخدم في وضع المسح

// التحقق مما إذا كان الجهاز يدعم اللمس
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

// استدعاء الدالة لتحديد نوع الجهاز
isTouchDevice();

// وظيفة لإنشاء الشبكة بناءً على العرض والارتفاع
gridButton.addEventListener("click", () => {
    container.innerHTML = ""; // مسح الشبكة الحالية
    let count = 0;

    // إنشاء الصفوف بناءً على قيمة الارتفاع
    for (let i = 0; i < gridHeight.value; i++) {
        count += 2;
        let div = document.createElement("div");
        div.classList.add("gridRow");

        // إنشاء الأعمدة داخل كل صف بناءً على قيمة العرض
        for (let j = 0; j < gridWidth.value; j++) {
            count += 2;
            let col = document.createElement("div");
            col.classList.add("gridcol");
            col.setAttribute("id", `gridCol${count}`);

            // إضافة حدث الرسم أو المسح لكل خلية عند الضغط عليها
            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                if (erase) {
                    col.style.backgroundColor = "transparent"; // مسح اللون إذا كان في وضع المسح
                } else {
                    col.style.backgroundColor = colorButton.value; // تغيير اللون إلى اللون المختار إذا كان في وضع الرسم
                }
            });

            // إضافة حدث عند تحريك الماوس أو اللمس
            col.addEventListener(events[deviceType].move, (e) => {
                if (draw) {
                    let elementID = document.elementFromPoint(
                        !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                        !isTouchDevice() ? e.clientY : e.touches[0].clientY
                    ).id;
                    checker(elementID); // التحقق من العنصر ورسمه أو مسحه
                }
            });

            // إيقاف الرسم عند إفلات الماوس أو رفع الإصبع
            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            div.appendChild(col);
        }
        container.appendChild(div); // إضافة الصف إلى الحاوية
    }
});

// وظيفة لتغيير لون الخلية أو مسحها بناءً على المعرف
function checker(elementID) {
    let gridColumns = document.querySelectorAll(".gridcol");
    gridColumns.forEach((element) => {
        if (elementID === element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value; // رسم اللون
            } else if (draw && erase) {
                element.style.backgroundColor = "transparent"; // مسح اللون
            }
        }
    });
}

// وظيفة لمسح الشبكة
clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
});

// تفعيل وضع المسح
eraseBtn.addEventListener("click", () => {
    erase = true;
});

// تفعيل وضع الرسم
paintBtn.addEventListener("click", () => {
    erase = false;
});

// تحديث قيمة العرض المعروضة
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 10 ? `0${gridWidth.value}` : gridWidth.value;
});

// تحديث قيمة الارتفاع المعروضة
gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 10 ? `0${gridHeight.value}` : gridHeight.value;
});

// ضبط قيم العرض والارتفاع عند تحميل الصفحة
window.onload = () => {
    gridWidth.value = 10;
    gridHeight.value = 10;
    widthValue.innerHTML = gridWidth.value;
    heightValue.innerHTML = gridHeight.value;
};
