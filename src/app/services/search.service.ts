import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Language } from '../models/Language';
import { Dictonary } from '../models/Dictonary';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  langList : Language[] = [];

  // api kulcs
  apiKey : String = "";

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  // API kulcs lekérdezése a környezeti változókból.
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    this.apiKey = environment.api_key_dict;
  }
  // A nyelvek betöltéséért felelő függvény. Hibakezelés logolással.
   async load(){
      var prom = this.http.get<String[]>(`https://dictionary.yandex.net/api/v1/dicservice.json/getLangs?key=${this.apiKey}`).toPromise();
      await prom.then((data)=> {
        this.langList = [];
        data.forEach( c => {
          var list = c.split('-');
          var l : Language = new Language();
          l.destinitionLanguage = list[1];
          l.sourceLanguage = list[0];
          this.langList.push(l);
        })
      }).catch((e) => {
        console.log(e);
      });
    }

    // Visszaadja a nyelvek listáját
    getLanguages() : Language[]{
      return this.langList;
    }

    // Visszadja a forrás nyelvek listáját, amiről szeretnénk fordítani úgy, hogy azok egyediek legyenek. (ne legyen duplikáció)
    getSourceLanguagesUnique() : String[]{
      var sources : String[] = [];
      var list = this.langList.filter((v,i,a)=>a.findIndex(t=>(t.sourceLanguage === v.sourceLanguage))===i).forEach( c => sources.push(c.sourceLanguage));
      return sources;
    }

    // Visszadja a cél nyelvek listáját, amire szeretnénk fordítani úgy, hogy azok egyediek legyenek. (ne legyen duplikáció)
    getDestinitionLanguagesUnique() : String[]{
      var dests : String[] = [];
      var list = this.langList.filter((v,i,a)=>a.findIndex(t=>(t.destinitionLanguage === v.destinitionLanguage))===i).forEach( c => dests.push(c.destinitionLanguage));
      return dests;
    }

    // Szűri a célnyelvet a forrás alapján. Ez ahhoz kell, hogy az oldalon csak az jelenjen meg célnyelvnek, amire az API tud fordítani.
    // Ha a "Miről" van kijelölve (mirol), akkor újra betöltődik az összes nyelv.
    filterDestinitionLanguages(source: String | undefined) : String[] {
      if(source === "mirol") return this.getDestinitionLanguagesUnique();
      var dests : String[] = [];
      var list = this.langList.filter(c => c.sourceLanguage===source).forEach( c => dests.push(c.destinitionLanguage));
      return dests;
    }

    // A keresést megvalósító függvény. A bejövő adatok itt a service-ben is le vannak ellenőrizve, ha érvénytelen akkor a snackbar jelzi.
    async searchByWord(sourceLang:string | undefined, destLang:string | undefined, word: string | undefined) : Promise<Dictonary | null> {
        if(this.checkEmptyHandler(sourceLang,destLang,word)) return null;
        return this.http.get<Dictonary>(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${this.apiKey}&lang=${sourceLang}-${destLang}&text=${word}`).toPromise();
    }

    // Snackbart beállító és megnyitó függvény.
    openSnackBar(message: string) {
      this._snackBar.open(message, 'Értem', {
        duration: 10000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['error']
      });
    }

    // Hibakezelés a kereséshez. A paraméterekben adott értékeket ellenőrzi és ha érvénytelen, akkor snackbarral jelzi a felhasználónak.
    checkEmptyHandler(sourceLang:string | undefined, destLang:string | undefined, word: string | undefined) : boolean{
      if(word === "" || word === undefined){
        this.openSnackBar("A kereséshez kérlek adj meg egy szót!");
        return true;
      }
      if(sourceLang === "mirol" || sourceLang === undefined) {
        this.openSnackBar("Válaszd ki azt a nyelvet amiről szeretnél fordítani!");
        return true;
      }
      if( destLang === "mire" || destLang === undefined){
        this.openSnackBar("Válaszd ki azt a nyelvet amire szeretnél fordítani!");
        return true;
      }
      
      return false;
    }
}
