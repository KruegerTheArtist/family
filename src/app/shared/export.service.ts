import { DatePipe } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ComponentType } from '@angular/cdk/portal';
import { IBabyPush } from './interfaces/baby-push.interface';

/** Сервис для работы с данными по страховкам */
@Injectable()
export class InsuranceExcelService {
  constructor(private _datePipe: DatePipe
  ) {}

  /** Выгрузить веб таблицу страховок в Excel */
  public exportToExcel = (entries: IBabyPush[], columns: InsuranceColumnMap): void => {
    /* Создание имени файлика */
    const filename = `${document.title}_${new Date().toLocaleDateString()}.xlsx`;

    const excelData: string[][] = this._creteArraysExcelData(entries);
    const excelHeaders: string[] =['Дата', 'Время'];
    // const excelHeaders: string[] = this._creteArrayExcelHeader(columns);

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([excelHeaders, ...excelData]);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'data');

    /* save to file */
    XLSX.writeFile(wb, filename);
  };

  /** Создание массива заголовков */
  private _creteArrayExcelHeader(columns: InsuranceColumnMap): string[] {
    const headerRow: string[] = [];
    columns.forEach((_value, _key) => {
    //   headerRow.push(this._i18n(_value.label));
    });
    return headerRow;
  }

  /** Создание массива данных для выгрузки в Excel */
  private _creteArraysExcelData(insurances: IBabyPush[]): string[][] {
    const entryRows: string[][] = [];

    insurances.forEach((entry) => {
      const arr: string[] = [];
      entryRows.push([`Дата: ${entry?.group}`]);
      if(entry.items && entry.items.length > 0) {
        entry.items.forEach(v => {
            let newArr: string[] = [];
            v = new Date(v);
            newArr.push(String(`${v.getDate()}.${v.getMonth() + 1}`) || '');
            newArr.push(String( this._datePipe.transform(v, 'HH:mm') || ''));
            entryRows.push(newArr);
        })
      }
      entryRows.push(['Общее количество за день:', entry?.total.toString()]);

    //   arr.push(entry?.total.toString());
    //   arr.push(entry?.phoneNumber);
    //   arr.push(entry?.orderId);
    //   arr.push(entry?.bikeIdentifier);

    //   const dateStart = this._datePipe.transform(entry?.orderStartUtc, 'dd.MM.y');
    //   const timeStart = this._datePipe.transform(entry?.orderStartUtc, 'HH:mm:ss');
    //   arr.push(dateStart);
    //   arr.push(timeStart);

    //   const dateEnd = this._datePipe.transform(entry?.orderEndUtc, 'dd.MM.y');
    //   const timeEnd = this._datePipe.transform(entry?.orderEndUtc, 'HH:mm:ss');
    //   arr.push(dateEnd);
    //   arr.push(timeEnd);

    //   arr.push(entry?.insuranceCost?.valueFormatted);
    //   arr.push(entry?.insuranceProviderCode);
    //   arr.push(entry?.insuranceNumber);
    //   const localizedIsFreeInsurance = String(
    //     this._i18n(`insurance.${String(entry?.isFreeInsurance)}`)
    //   );
    //   arr.push(localizedIsFreeInsurance);
    //   arr.push(entry?.useZoneName);

      entryRows.push(arr);
    });
    return entryRows;
  }
}


/** Класс с колонками */
export class InsuranceColumnMap extends Map<keyof IBabyPush | string, IColumnDescriptor> {
    constructor() {
      super([
        [
          'activeDate',
          {
            label: 'insurance.model.accountId',
            type: ColumnType.Raw,
            options: { excelHidden: true },
          },
        ],
        [
          'group',
          {
            label: 'insurance.model.phoneNumber',
            type: ColumnType.Raw,
          },
        ],
        [
          'total',
          {
            label: 'insurance.model.orderId',
            type: ColumnType.Raw,
          },
        ],
        [
          'bikeIdentifier',
          {
            label: 'insurance.model.bikeIdentifier',
            type: ColumnType.Raw,
          },
        ],
        [
          'orderStartUtc',
          {
            label: 'insurance.model.orderStartUtc',
            type: ColumnType.Date,
            options: {
              format: 'medium',
            },
          },
        ],
        [
          'orderStartTimeUtc',
          {
            label: 'insurance.model.orderStartTimeUtc',
            type: ColumnType.Date,
            options: {
              format: 'medium',
            },
          },
        ],
        [
          'orderEndUtc',
          {
            label: 'insurance.model.orderEndUtc',
            type: ColumnType.Date,
            options: {
              format: 'medium',
            },
          },
        ],
        [
          'orderEndTimeUtc',
          {
            label: 'insurance.model.orderEndTimeUtc',
            type: ColumnType.Date,
            options: {
              format: 'medium',
            },
          },
        ],
        [
          'insuranceCost.valueFormatted',
          {
            label: 'insurance.model.insuranceCost',
            type: ColumnType.Raw,
          },
        ],
        [
          'insuranceProviderCode',
          {
            label: 'insurance.model.insuranceProviderCode',
            type: ColumnType.Raw,
          },
        ],
        [
          'insuranceNumber',
          {
            label: 'insurance.model.insuranceNumber',
            type: ColumnType.Raw,
          },
        ],
        [
          'isFreeInsurance',
          {
            label: 'insurance.model.isFreeInsurance',
            type: ColumnType.Boolean,
          },
        ],
        [
          'useZoneName',
          {
            label: 'insurance.model.useZoneName',
            type: ColumnType.Raw,
          },
        ],
      ]);
    }
  }
  
export const enum ColumnType {
    Raw = 'Raw',
    Array = 'Array',
    Boolean = 'Boolean',
    Date = 'Date',
    Money = 'Money',
    PhoneNumber = 'PhoneNumber',
  }
  
  export interface IColumnDescriptor<E = Record<string, any>, C = unknown> {
    component?: ComponentType<C>;
    type?: ColumnType | string;
    label?: string;
    options?: unknown;
    hidden?: boolean;
  
    // hooks
    getContent?: (column: string, entry: E) => string;
  }
  
