class CalculatorCpk {
  allValues;
  allValuesLength;
  deviation;
  avg;
  CPK;

  constructor() {
    this.btn = document.querySelector(".btn");
    this.result = document.querySelector(".result");
    this.calculate();
  }
  value() {
    const inputValues = document.querySelector(".input-values").value;
    this.allValues = inputValues.split(" ").filter((el) => el !== "" && el);
    this.allValuesLength = this.allValues.length;
  }

  calculateAvgAndDeviation() {
    this.value();

    // AVG
    this.avg = +(
      this.allValues.reduce((acc, cur) => (cur !== "" ? +cur + acc : acc), 0) /
      this.allValuesLength
    ).toFixed(4);

    // DEV
    this.deviation =
      this.allValues.reduce((acc, cur) => {
        return acc + Math.pow(cur - this.avg, 2);
      }, 0) /
      (this.allValuesLength - 1);
    this.deviation = +Math.sqrt(this.deviation).toFixed(4);
  }

  calculate() {
    this.btn.addEventListener("click", (e) => {
      e.preventDefault();
      this.calculateAvgAndDeviation();

      const USL = +document.querySelector(".input-usl").value;
      const LSL = +document.querySelector(".input-lsl").value;
      const low = ((USL - this.avg) / 3) * this.deviation;
      const high = ((this.avg - LSL) / 3) * this.deviation;

      this.CPK = Math.min(low, high);
      this.result.innerHTML = this.CPK.toFixed(4);
      this.exportToExcel();
    });
  }
  exportToExcel() {
    // Structura datelor
    const ws_data = [
      [
        "Input Values",
        "Average (µ)",
        "Standard Deviation (σ)",
        "USL",
        "LSL",
        "CPK",
      ],

      [
        "",
        this.avg,
        this.deviation,
        document.querySelector(".input-usl").value,
        document.querySelector(".input-lsl").value,
        this.CPK,
      ],
      ...this.allValues.map((value) => [value]),
    ];

    // Crearea sheet-ului și workbook-ului
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CPK Data");

    // Salvarea fișierului
    XLSX.writeFile(wb, "CPK_Data.xlsx");
  }
}

const calculator = new CalculatorCpk();

/* 
10 12 11 13 12 14 11 13 15 12
123
124
125
200
399
5999
1.23
1.232
123123
123
124
125
200
399
5999
1.23
1.232
123123
123
124
125
200
399
5999
1.23
1.232
123123
123
124
125
200
399
5999
1.23
1.232
123123


*/
