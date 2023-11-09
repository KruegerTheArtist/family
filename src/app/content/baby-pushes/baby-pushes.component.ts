import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DataService } from './baby-pushes.service';
import { InsuranceColumnMap, InsuranceExcelService } from 'src/app/shared/export.service';
import { DatePipe } from '@angular/common';
import { Margins } from 'pdfmake/interfaces';

export interface ITransaction {
  items: Date[];
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
  ];

  data = new ExampleDataSource(this.transactions)
  constructor(private _cdr: ChangeDetectorRef, private _dataService: DataService, private _export: InsuranceExcelService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    let babyPushes = this._dataService.getBabyPushes() as ITransaction[];
    let multiGroup: string = '';
    babyPushes.forEach(xs => {
      if (babyPushes.filter(x => x.group === xs.group).length > 1) {
        multiGroup = xs.group;
      }
    })
    if (multiGroup) {
      let index = babyPushes.findIndex(b => b.group === multiGroup);
      if (index > -1) {
        let neededAddItems = babyPushes.filter(b => b.group === multiGroup).map(x => x.items).join(',').split(',').sort((a, b) => a > b ? 1 : -1).map(d => new Date(d));
        babyPushes.splice(index, 1);
        let newindex = babyPushes.findIndex(b => b.group === multiGroup);
        babyPushes[newindex].items = neededAddItems;
        babyPushes[newindex].total = neededAddItems.length;
      }
    }
    if (babyPushes) {
      this.transactions = babyPushes;
    }
  }

  getCurrentNumberWeeksAndDays(curr = new Date()) {
    let firstDate = new Date("2023-04-25");
    curr.setHours(0);
    curr.setMinutes(0);
    curr.setSeconds(0);
    curr.setMilliseconds(0);
    var weeks = Math.round((curr as any - (firstDate as any)) / 604800000);
    const days = (curr as any - (firstDate as any)) / (1000 * 60 * 60 * 24);
    let strDay = (Math.ceil(days) - weeks * 7) === 0 ? '' : ` и ${(Math.ceil(days) - weeks * 7)} дн.`;
    return ` ${weeks} нед. ${strDay}`
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
              return [String(`${v.getDate()}.${v.getMonth() + 1}`), String(this._datePipe.transform(v, 'HH:mm'))]
            }),
            ['Общее количество толчков: ', x.items.length]
          ]
        }
      }]))
    let docDefinition = {
      header: 'Таблица толчков',
      content: [array],
      styles: {
        sectionHeader: {
          bold: true,
          margin: [0, 15, 0, 0] as Margins,
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }

  addData() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const groupString = `${day}.${month}. ${this.getCurrentNumberWeeksAndDays()}`;

    const transIndex = this.transactions.findIndex(x => x.group === groupString);
    if (transIndex > -1) {
      this.transactions[transIndex].items.push(new Date());
      this.transactions[transIndex].total += 1;
      this.transactions[transIndex].items.sort();
    } else {
      this.transactions.push({ activeDate: new Date(), items: [new Date()], group: groupString, total: 1 })
    }
    this.transactions.forEach(x => {
      if (x.group.length < 6) {
        x.group = x.group + this.getCurrentNumberWeeksAndDays(new Date(x.group.split('.').reverse().join('-') + '-2023'))
      }
    })
    this._dataService.saveLocal([...this.transactions.filter(x => x.group !== '31.10 27 нед.')]);
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
