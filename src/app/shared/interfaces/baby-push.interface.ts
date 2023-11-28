export interface IBabyPush {
    /** даты толканий */
    items: Date[];
    /** даты толканий */
    activeDate?: Date;
    /** Группировка толканий по дате + инфа о неделе и дне */
    group: string;
    /** общее количество толканий */
    total: number
  }