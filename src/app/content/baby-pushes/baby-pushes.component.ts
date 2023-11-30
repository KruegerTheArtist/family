import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ExportService } from '../../shared/export.service';
import { IBabyPush } from '../../shared/interfaces/baby-push.interface';
import { getCurrentNumberWeeksAndDays } from '../../shared/utils/date-helper.utils';
import { DataService } from './baby-pushes.service';

/** Таблица толчков */
@Component({
  selector: 'app-baby-pushes',
  templateUrl: './baby-pushes.component.html',
  styleUrls: ['./baby-pushes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BabyPushesComponent implements OnInit, OnDestroy {
  /** Толчки детёныша */
  babyPushes: IBabyPush[] = [];

  /** Выбранные для удаления даты */
  selectedDates: Map<string, Date[]> = new Map<string, Date[]>();

  /** @inheritdoc */
  constructor(
    private _dataService: DataService,
    private _exportService: ExportService,
    private _cdr: ChangeDetectorRef) { }

  /** @inheritdoc */
  ngOnInit(): void {
    let babyPushes = this._dataService.getBabyPushes() as IBabyPush[];
    this._checkMultiGroup(babyPushes);
    if (babyPushes) {
      this.babyPushes = babyPushes;
    }
    this._cdr.detectChanges();
  }

  /** @inheritdoc */
  ngOnDestroy(): void {
    this._dataService.saveLocal([...this.babyPushes.filter(x => x.group !== '31.10 27 нед.')]);
  }

  /** Выбран ли элемент */
  isSelected(itemGroup: string, value: Date): boolean {
    const dates = this.selectedDates.get(itemGroup);
    return !!dates && dates.includes(value);
  }

  /** Выбрать запись для удаления */
  select(itemGroup: string, value: Date): void {
    const dates = this.selectedDates.get(itemGroup);
    if (dates && dates.includes(value)) {
      const newDates = dates.filter(x => x !== value);
      if (newDates.length) {
        this.selectedDates.set(itemGroup, dates.filter(x => x !== value));
      } else {
        this.selectedDates.delete(itemGroup);
      }
    }
    if (!dates || !dates.includes(value)) {
      if (dates) {
        this.selectedDates.set(itemGroup, [value, ...dates]);
      } else {
        this.selectedDates.set(itemGroup, [value]);
      }
    }
  }

  /** Добавить толчок */
  addBabyPush(): void {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const groupString = `${day}.${month}${getCurrentNumberWeeksAndDays()}`;
    this.babyPushes.forEach(x => {
      if (x.group.length < 6) {
        x.group = x.group + getCurrentNumberWeeksAndDays(this._getDate(x));
      }
    })

    const transIndex = this.babyPushes.findIndex(x => x.group === groupString);
    if (transIndex > -1) {
      this.babyPushes[transIndex].items.push(new Date());
      this.babyPushes[transIndex].total += 1;
      this.babyPushes[transIndex].items.sort();
    } else {
      this.babyPushes.push({ items: [new Date()], group: groupString, total: 1 })
    }
    this._dataService.saveLocal([...this.babyPushes.filter(x => x.group !== '31.10 27 нед.')]);
    this._cdr.detectChanges();
    let elem = document.getElementsByClassName('our-table');
    elem[0].scrollTo(document.body.scrollHeight, 13000)
  }

  /** Удалить выбранные записи */
  delete(): void {
    if (this.selectedDates.size) {
      this.selectedDates.forEach((v, k) => {
        const pushesIndex = this.babyPushes.findIndex(x => x.group === k);
        if (pushesIndex > -1) {
          v.forEach(d => {
            this.babyPushes[pushesIndex].items = this.babyPushes[pushesIndex].items.filter(i => i !== d);
            this.babyPushes[pushesIndex].total -= 1;
          })
        }
      })
      this._dataService.saveLocal([...this.babyPushes.filter(x => x.group !== '31.10 27 нед.')]);
      this.selectedDates.clear();
      this._cdr.detectChanges();
    }
  }

  /** Экспорт в excel */
  exportToExcel(): void {
    this._exportService.exportToExcel(this.babyPushes)
  }

  /** Экспорт в pdf */
  exportToPdf(): void {
    this._exportService.exportToPdf(this.babyPushes);
  }

  /** Проверить на мультигруппы */
  private _checkMultiGroup(babyPushes: IBabyPush[]): void {
    let freakGroup = babyPushes.find(x => x.group === '9.11 . 28 нед.  и 2 дн.');
      console.log('freak', babyPushes);
      if (freakGroup) {
      console.log('freak');
      
      freakGroup.group = '9.11. 28 нед. и 2 дн.';
    }
    /** Если групп несколько */
    let multiGroup: string = '';

    /** Если групп несколько */
    babyPushes.forEach(xs => {
      if (babyPushes.filter(x => x.group === xs.group).length > 1) {
        multiGroup = xs.group;
      }
    })
    /** Если групп несколько */
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
    babyPushes = [...babyPushes.map(x => {
      return { group: x.group, items: x.items.sort((a, b) => a > b ? 1 : -1), total: x.total }
    })]
  }

  /** Редко используемая штука для чистки группы */
  private _clearAdditionalInfoInToGroup(babyPushes: IBabyPush[]): void {
    babyPushes.forEach(xs => {
      if (xs.group.length > 5) {
        let temp = xs.group.slice(0, 5);
        if (temp[4] === '.') {
          temp = temp.slice(0, 4);
        }
        console.log('temp', temp);
        // xs.group = temp;
      }
    })
  }

  /** Получение даты в формате ММ-DD-YYYY */
  private _getDate(babyPush: IBabyPush): Date {
    return new Date(babyPush.group.split('.').map(x => {
      if (x.length == 1) {
        return `0${x}`.trim()
      }
      return x.trim()
    }).reverse().join('-') + '-2023')
  }
}
