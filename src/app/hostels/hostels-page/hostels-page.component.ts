import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subscription, of } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Hostel {
  Name: string;
  Id: string;
  Images: string[];
  Description: string;
  Latitude: number;
  Longitude: number;
  DateAdded: Date;
  ContactEmail: string;
  ContactPhone: string;
}

@Component({
  selector: 'app-hostels-page',
  templateUrl: './hostels-page.component.html',
  styleUrls: ['./hostels-page.component.scss']
})
export class HostelsPageComponent implements OnInit, OnDestroy, AfterViewChecked {

  private hostels: Hostel[] = [];
  private hostelsSubscription: Subscription;
  currentPage = 0;
  currentSize = 10;
  private contentObserver: IntersectionObserver;
  batchFetching = false;

  constructor(public readonly httpClient: HttpClient, private ref: ChangeDetectorRef) { }

  getHostelsBatch(batchNo: number = 0, size: number = 50): void {
    this.batchFetching = true;
    this.httpClient
      .get<{ value: Hostel[] }>(
        `${environment.apiOrigin}/odata/hostels`,
        {
          params: new HttpParams(
            {
              fromString: `$skip=${batchNo * size}&$orderby=dateadded desc&$top=${size}&$select=Name,ContactPhone,ContactEmail,Id,Images,Description,Latitude,Longitude,DateAdded`
            })
        })
      .subscribe(data => {
        data.value.forEach(hostel => this.hostels.push(hostel));
        this.batchFetching = false;
        // this.hostels = this.hostels;
        this.ref.markForCheck();
      }, () => this.batchFetching = false, () => this.currentPage += 1);
  }

  collapseCard = (id: string) => {
    const card = document.getElementById(id);
    if (card.style.maxHeight === '150px') {
      card.style.maxHeight = 'auto';
    } else {
      card.style.maxHeight = '150px';
    }
  } 

  ngOnInit(): void {
    const loadTrigger = document.getElementById('load-trigger');
    if (loadTrigger && !this.contentObserver) {
      this.contentObserver = new IntersectionObserver(this.loadMoreHostels, { threshold: 0, rootMargin: '0px 0px -10px 0px' });
      this.contentObserver.observe(loadTrigger);
    }
    // this.getHostelsBatch(this.currentPage, this.currentSize);
  }

  ngAfterViewChecked(): void {
    // debugger
  }

  loadMoreHostels = () => {
    if (!this.batchFetching) {
      setTimeout(() => this.getHostelsBatch(this.currentPage, this.currentSize), 500);
    }
  }

  imageLoad = () => {
    // console.log(event);
  }

  imageLoadError = (id: string) => {
    const img: HTMLImageElement = document.getElementById(id) as HTMLImageElement;
    img.remove();
  }

  ngOnDestroy(): void {
    this.hostelsSubscription?.unsubscribe();
  }

  get hostels$(): Observable<Hostel[]> {
    return of(this.hostels);
  }

}
