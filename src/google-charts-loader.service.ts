declare var google: any;

import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class GoogleChartsLoaderService {

  private chartPackage: { [id: string]: string; } = {
    AnnotationChart: 'annotationchart',
    AreaChart: 'corechart',
    Bar: 'bar',
    BarChart: 'corechart',
    BubbleChart: 'corechart',
    Calendar: 'calendar',
    CandlestickChart: 'corechart',
    ColumnChart: 'corechart',
    ComboChart: 'corechart',
    PieChart: 'corechart',
    Gantt: 'gantt',
    Gauge: 'gauge',
    GeoChart: 'geochart',
    Histogram: 'corechart',
    Line: 'line',
    LineChart: 'corechart',
    Map: 'map',
    OrgChart: 'orgchart',
    Sankey: 'sankey',
    Scatter: 'scatter',
    ScatterChart: 'corechart',
    SteppedAreaChart: 'corechart',
    Table: 'table',
    Timeline: 'timeline',
    TreeMap: 'treemap',
    WordTree: 'wordtree'
  };

  private googleScriptLoadingNotifier: EventEmitter<boolean>;

  public constructor() {
    this.googleScriptLoadingNotifier = new EventEmitter();
    this.googleScriptIsLoading = false;
  }

  public load(chartType: string):Promise<any> {
    return new Promise((resolve: any = Function.prototype, reject: any = Function.prototype) => {

      this.loadGoogleChartsScript().then(() => {
        google.charts.load('45', {
          packages: [this.chartPackage[chartType]],
          callback: resolve
        });
      }).catch(() => {
        console.error('Google charts script could not be loaded');
      });

    });
  }

  private loadGoogleChartsScript(): Promise<any> {
    return new Promise((resolve: any = Function.prototype, reject: any = Function.prototype) => {

      if (typeof google !== 'undefined' && google.charts) {
        resolve();
      } else if ( ! window['ng2-google-charts.googleScriptIsLoading']) {

        window['ng2-google-charts.googleScriptIsLoading'] = true;

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          window['ng2-google-charts.googleScriptIsLoading'] = false;
          this.googleScriptLoadingNotifier.emit(true);
          resolve();
        };
        script.onerror = () => {
          window['ng2-google-charts.googleScriptIsLoading'] = false;
          this.googleScriptLoadingNotifier.emit(false);
          reject();
        };
        document.getElementsByTagName('head')[0].appendChild(script);

      } else {
        this.googleScriptLoadingNotifier.subscribe((loaded: boolean) => {
          if (loaded) {
            resolve();
          } else {
            reject();
          }
        });
      }

    });
  }
}
