import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { IBabyPush } from './interfaces/baby-push.interface';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Margins } from 'pdfmake/interfaces';

/** Сервис для работы с данными по страховкам */
@Injectable()
export class ExportService {
  constructor(private _datePipe: DatePipe
  ) { }

  /** Экспорт в pdf */
  exportToPdf(babyPushes: IBabyPush[]) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    let array = babyPushes.map(x => ([// Previous configuration  
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

  /** Выгрузить веб таблицу страховок в Excel */
  public exportToExcel = (entries: IBabyPush[]): void => {
    /* Создание имени файлика */
    const filename = `${document.title}_${new Date().toLocaleDateString()}.xlsx`;

    const excelData: string[][] = this._creteArraysExcelData(entries);
    const excelHeaders: string[] = ['Дата', 'Время'];

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([excelHeaders, ...excelData]);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'data');

    /* save to file */
    XLSX.writeFile(wb, filename);
  };

  /** Создание массива данных для выгрузки в Excel */
  private _creteArraysExcelData(insurances: IBabyPush[]): string[][] {
    const entryRows: string[][] = [];

    insurances.forEach((entry) => {
      const arr: string[] = [];
      entryRows.push([`Дата: ${entry?.group}`]);
      if (entry.items && entry.items.length > 0) {
        entry.items.forEach(v => {
          let newArr: string[] = [];
          v = new Date(v);
          newArr.push(String(`${v.getDate()}.${v.getMonth() + 1}`) || '');
          newArr.push(String(this._datePipe.transform(v, 'HH:mm') || ''));
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


// /** Класс с колонками */
// export class InsuranceColumnMap extends Map<keyof IBabyPush | string, IColumnDescriptor> {
//   constructor() {
//     super([
//       [
//         'activeDate',
//         {
//           label: 'insurance.model.accountId',
//           type: ColumnType.Raw,
//           options: { excelHidden: true },
//         },
//       ],
//       [
//         'orderStartUtc',
//         {
//           label: 'insurance.model.orderStartUtc',
//           type: ColumnType.Date,
//           options: {
//             format: 'medium',
//           },
//         },
//       ],
//       [
//         'isFreeInsurance',
//         {
//           label: 'insurance.model.isFreeInsurance',
//           type: ColumnType.Boolean,
//         },
//       ],
//     ]);
//   }
// }

// export const enum ColumnType {
//   Raw = 'Raw',
//   Array = 'Array',
//   Boolean = 'Boolean',
//   Date = 'Date',
//   Money = 'Money',
//   PhoneNumber = 'PhoneNumber',
// }

// export interface IColumnDescriptor<E = Record<string, any>, C = unknown> {
//   component?: ComponentType<C>;
//   type?: ColumnType | string;
//   label?: string;
//   options?: unknown;
//   hidden?: boolean;

//   // hooks
//   getContent?: (column: string, entry: E) => string;
// }

