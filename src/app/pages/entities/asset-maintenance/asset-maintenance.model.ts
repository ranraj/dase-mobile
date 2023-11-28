import { BaseEntity } from 'src/model/base-entity';

export const enum MeasurementTime {
  'Seconds',
  'Minutes',
  'Hours',
  'Days',
  'Months',
  'Years',
}

export class AssetMaintenance implements BaseEntity {
  constructor(
    public id?: number,
    public serviceRunningTime?: number,
    public serviceRunningTimeMeasurement?: MeasurementTime,
    public restIntervalTime?: number,
    public restIntervalTimeMeasurement?: MeasurementTime,
    public nextServiceDate?: any
  ) {}
}
