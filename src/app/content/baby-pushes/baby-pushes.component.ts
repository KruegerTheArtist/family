import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DataService } from './baby-pushes.service';
import { InsuranceColumnMap, InsuranceExcelService } from 'src/app/shared/export.service';
import { DatePipe } from '@angular/common';

export interface ITransaction {
  items: Date[];
  cost: number;
  activeDate: Date;
  group: string;
  total: number
}

@Component({
  selector: 'app-baby-pushes',
  templateUrl: './baby-pushes.component.html',
  styleUrls: ['./baby-pushes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BabyPushesComponent implements OnInit {
  displayedColumns: string[] = ['activeDate', 'activeTime'];
  transactions: ITransaction[] = [
    {items: [new Date()], activeDate: new Date(), cost: 0, group: '30.10', total: 1}
  ];

  data = new ExampleDataSource(this.transactions)
  constructor(private _cdr: ChangeDetectorRef, private _dataService: DataService, private _export: InsuranceExcelService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    let babyPushes = this._dataService.getBabyPushes();
    if (babyPushes) {
      this.transactions = babyPushes;
    }
  }

  export() {
    let columns = new InsuranceColumnMap();
    this._export.exportToExcel(this.transactions, columns)
  }

  exportToPdf() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    let array = this.transactions.map(x => ([// Previous configuration  
      {
        text: String(`${x.group}`),
        style: 'sectionHeader'
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,  
          widths: ['*', 'auto'], 
          body: [
            ['Дата', 'Время'],
            ...x.items?.map((v, i) => {
              v = new Date(v);
              if(i === x.items.length - 1) {
                return ['Общее количество толчков: ', x.items.length]
              }
              return [String(`${v.getDate()}.${v.getMonth() + 1}`), String(this._datePipe.transform(v, 'HH:mm'))]
            })
          ]
        }
      }]))
      console.log('array ', array);
      
    let docDefinition = {
      header: 'Таблица толчков',
      content: [array]
    };

    pdfMake.createPdf(docDefinition).open();
  }

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  addData() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const groupString = `${day}.${month}`;
    const transIndex = this.transactions.findIndex(x => x.group === groupString);
    if (transIndex > -1) {
      this.transactions[transIndex].items.push(new Date());
      this.transactions[transIndex].total += 1;
      this.transactions[transIndex].items.sort();
    } else {
      this.transactions.push({ activeDate: new Date(), items: [new Date()], cost: 0, group: groupString, total: 1 })
    }
    this._dataService.saveLocal([...this.transactions.filter(x => x.group !== '30.10')]);
    this._cdr.detectChanges();
  }

}

class ExampleDataSource extends DataSource<ITransaction> {
  private _dataStream = new ReplaySubject<ITransaction[]>();

  constructor(initialData: ITransaction[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ITransaction[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: ITransaction[]) {
    this._dataStream.next(data);
  }
}
