import {Component, Injector, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import { TimeEntryResource } from 'core-app/modules/hal/resources/time-entry-resource';
import {CollectionResource} from "core-app/modules/hal/resources/collection-resource";
import {TimezoneService} from "core-components/datetime/timezone.service";
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {PathHelperService} from "core-app/modules/common/path-helper/path-helper.service";
import {AbstractWidgetComponent} from "core-app/modules/grids/widgets/abstract-widget.component";

@Component({
  templateUrl: './time-entries-current-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetTimeEntriesCurrentUserComponent extends AbstractWidgetComponent {
  public entries:TimeEntryResource[] = [];

  constructor(protected readonly injector:Injector,
              readonly timezone:TimezoneService,
              readonly i18n:I18nService,
              readonly pathHelper:PathHelperService,
              protected readonly cdr:ChangeDetectorRef) {
    super(i18n, injector);
  }

  public updateEntries(entries:CollectionResource<TimeEntryResource>) {
    this.entries = entries.elements;

    this.cdr.detectChanges();
  }

  public get total() {
    let duration = this.entries.reduce((current, entry) => {
      return current + this.timezone.toHours(entry.hours);
    }, 0);

    if (duration > 0) {
      return this.i18n.t('js.units.hour', { count: this.formatNumber(duration) });
    } else {
      return this.i18n.t('js.placeholders.default');
    }
  }

  public get isEditable() {
    return false;
  }

  protected formatNumber(value:number):string {
    return this.i18n.toNumber(value, { precision: 2 });
  }
}
