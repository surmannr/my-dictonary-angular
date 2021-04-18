import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Language } from 'src/app/models/Language';
import { SearchService } from 'src/app/services/search.service';
import * as $ from 'jquery';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit,AfterViewInit {

  constructor(private searchService: SearchService) {

    let local = JSON.parse(localStorage.getItem('searchdata')!);
    this.translation = local;    
    if(this.translation != null)
      this.countOfWords = this.translation.length;
    this.dataSource = new MatTableDataSource(this.translation);
  }
  
  dataSource = new MatTableDataSource<String[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // tábla oszlopai
  displayedColumns: string[] = ["forrás","eredmény"]

  translation: Array<String[]> = [];

  sourceLanguages: String[] = [];
  destinitionLanguages: String[] = [];

  languageSelectedSource: String = 'Miről';
  languageSelectedDestinition: String = 'Mire';

  countOfWords : number = 0;

  async ngOnInit() {
    await this.searchService.load();
    this.setSourceAndDestinition();
  }

  // Az elérhető nyelvek beállítása külön tömbökbe forrás és cél szerint úgy, hogy ábécé sorrendben legyen.
  setSourceAndDestinition() {
    this.sourceLanguages = this.searchService.getSourceLanguagesUnique().sort((a,b) => this.sortList(a,b))
    this.destinitionLanguages = this.searchService.getDestinitionLanguagesUnique().sort((a,b) => this.sortList(a,b))
  }

  // Az ábécé sorrendet megvalósító függvény - ez azért szükséges, mert országkód alapján vannak a nyelvek beazonosítva és úgy más az ábécé sorrend.
  sortList(a : String,b : String){
      let a2 : string = this.convertToNormalName(a).toString();
      let b2 : string = this.convertToNormalName(b).toString();
      return a2.localeCompare(b2);
  }

  // Ha az oldalon kiválasztjuk a nyelvet amiről fordítani szeretnénk, akkor frissül az ahhoz elérhető célnyelvek listája ábécé sorrendben.
  selectSourceLang() {
    var source = $('#sourceId').val();
    this.destinitionLanguages = this.searchService.filterDestinitionLanguages(
      source?.toString()
    ).sort((a,b) => this.sortList(a,b));
  }

  // Keresést megvalósító függvény. jQuery-s lekérdezéssel az adatokat lekérjük, majd ezt ellenőrizzük, hogy érvényes-e.
  // Meghívódik a service searchByWord függvénye, ami előállítja a találatokat és hozzáadja a listához. Eközben egy számláló is fut, hogy kijelezze a találatok számát.
  // Amennyiben a felhasználó érvénytelen adatot ad meg egy snackbar figyelmezteti, hogy melyik input mezőben adott meg rossz értéket.
  async searchClick() {
    var source = $('#sourceId').val()?.toString();
    var destinition = $('#destinitionId').val()?.toString();
    var word = $('#search-word').val()?.toString();

    let check = this.searchService.checkEmptyHandler(source,destinition,word);
    if(check) return;
    this.countOfWords = 0;

    await this.searchService
      .searchByWord(source, destinition, word)
      .then((data) => {
        this.translation = [];
        var a = data?.def;
        a?.forEach((c) => {
          var temp: String[] = [];
          temp.push(c.text);
          let mean: string = '';
          c.tr.forEach((tran) => {
            if (mean != '') mean = mean + ' , ' + tran.text;
            else mean = mean + tran.text;
          });
          temp.push(mean);
          this.translation.push(temp);
          this.countOfWords += 1;
          this.dataSource = new MatTableDataSource<String[]>(this.translation);
        });
        if(this.countOfWords==0) this.searchService.openSnackBar("Nem található a keresett elem az adatbázisban!");
      })
      .catch((e) => console.log(e));
      localStorage.setItem('searchdata', JSON.stringify(this.translation));
  }
  
  // Országkód alapján visszaadja az ország tényleges nevét.
  convertToNormalName(code: String) {
    switch (code) {
      case 'en':
        return 'Angol';
      case 'hu':
        return 'Magyar';
      case 'ru':
        return 'Orosz';
      case 'be':
        return 'Belarusz';
      case 'bg':
        return 'Bolgár';
      case 'cs':
        return 'Cseh';
      case 'da':
        return 'Dán';
      case 'de':
        return 'Német';
      case 'el':
        return 'Görög';
      case 'es':
        return 'Spanyol';
      case 'et':
        return 'Észt';
      case 'fi':
        return 'Finn';
      case 'fr':
        return 'Francia';
      case 'it':
        return 'Olasz';
      case 'lt':
        return 'Litván';
      case 'lv':
        return 'Lett';
      case 'nl':
        return 'Holland';
      case 'no':
        return 'Norvég';
      case 'pl':
        return 'Lengyel';
      case 'pt':
        return 'Portugál';
      case 'sk':
        return 'Szlovák';
      case 'sv':
        return 'Svéd';
      case 'tr':
        return 'Török';
      case 'tt':
        return 'Tatár';
      case 'uk':
        return 'Ukrán';
      case 'zh':
        return 'Kínai';
      case 'mrj':
        return 'Hill Mari';
      case 'mhr':
        return 'Mari';
      default:
        return code;
    }
  }
}
