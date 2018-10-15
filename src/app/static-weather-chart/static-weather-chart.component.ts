import { Component, OnInit } from '@angular/core';
import { WeatherDetailService } from '../weather-detail/weather-detail.service';
import { MatDialog } from '@angular/material';
import { WeatherChartComponent } from '../weather-chart/weather-chart.component';

@Component({
  selector: 'app-static-weather-chart',
  templateUrl: './static-weather-chart.component.html',
  styleUrls: ['./static-weather-chart.component.css']
})
export class StaticWeatherChartComponent implements OnInit {

  chartData: any;
  private weatherData: any[];
  private dates: any[];
  selectionMode: any[];
  isRange: boolean;
  retrived_response: any;
  constructor(private weatherService: WeatherDetailService,
    public dialog: MatDialog) {
    this.chartData = {

    }
  }

  ngOnInit() {
    this.weatherService.weatherDataProcessed.subscribe(res => {
      this.isRange = res.isRange;
      this.retrived_response = res;
      if (this.isRange) {
        this.weatherData = res.weather;
        this.dates = res.dates;
        this.processRangeChart();
      } else {
        this.weatherData = res.hourly.data
        this.processSingleChart();
      }
    })


  }

  processSingleChart() {
    const labels = Array(23).fill(0).map((e, i) => i + 1)
    const rainfallIntensities = [];
    this.weatherData.forEach(element => {
      rainfallIntensities.push(element.precipIntensity)
    })

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Hourly Rainfall',
          data: rainfallIntensities,
          borderColor: '#4bc0c0'
        }
      ]
    }
  }

  processRangeChart() {
    const labels = []
    const rainfallIntensities = []

    this.dates.forEach(element => {
      labels.push(new Date(element).getDate());
    });

    this.weatherData.forEach(element => {
      rainfallIntensities.push(element.daily.data[0].precipIntensity)
    })

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'First Dataset',
          data: rainfallIntensities,
          borderColor: '#4bc0c0'
        }
      ]
    }

  }

  openDialogChart() {
    const dialogRef = this.dialog.open(WeatherChartComponent, {
      height: '600px',
      width: '1000px',
      data: this.retrived_response,
    })
  }
}


