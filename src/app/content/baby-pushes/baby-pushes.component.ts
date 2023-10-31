import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {DataSource} from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { DataService } from './baby-pushes.service';
import { InsuranceColumnMap, InsuranceExcelService } from 'src/app/shared/export.service';

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
    // {item: 'Beach ball', activeDate: new Date(), cost: 4},
    // {item: 'Towel', activeDate: new Date(), cost: 5},
    // {item: 'Frisbee', activeDate: new Date(), cost: 2},
    // {item: 'Sunscreen', activeDate: new Date(), cost: 4},
    // {item: 'Cooler', activeDate: new Date(), cost: 25},
    // {item: 'Swim suit', activeDate: new Date(), cost: 15},
    {items: [new Date()], activeDate: new Date(), cost: 0, group: '30.10', total: 1}
  ];

  data = new ExampleDataSource(this.transactions)
  constructor(private _cdr: ChangeDetectorRef, private _dataService: DataService, private _export: InsuranceExcelService) {}

  ngOnInit(): void {
    this._dataService.getData().subscribe({ next(value) {
      console.log('value ', value);
      
    },});
    let babyPushes = this._dataService.getBabyPushes();
    if(babyPushes) {
      this.transactions = babyPushes;
    }
    console.log('this._dataService.getBabyPushes() ', this._dataService.getBabyPushes());
  }

  export() {
    let columns = new InsuranceColumnMap();
    this._export.exportToExcel(this.transactions, columns)
  }

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  addData() {
    this._dataService.getData().subscribe({ next(value) {
      console.log('value ', value);
      
    },});
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const groupString = `${day}.${month}`;
    const transIndex = this.transactions.findIndex(x => x.group === groupString);
    if(transIndex > -1) {
      this.transactions[transIndex].items.push(new Date());
      this.transactions[transIndex].total += 1;
      this.transactions[transIndex].items.sort();
    } else {
      this.transactions.push({activeDate: new Date(), items:[new Date()], cost: 0, group: groupString, total: 1})
    }
    // this.data.setData(this.transactions);
    this._cdr.detectChanges();
    console.log('this.transactions ', this.transactions);
    this._dataService.saveLocal(this.transactions);
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

  disconnect() {}

  setData(data: ITransaction[]) {
    this._dataStream.next(data);
  }
}
