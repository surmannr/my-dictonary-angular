import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Synonyms } from '../models/Synonyms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SynonymService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { 
    this.apiKey = environment.apy_key_syn;
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  // api kulcs
  apiKey : String = "";

  // Nem lehet lekérni a használt API-ból, ezért muszáj beleégetni a programba a nyelveket. (ez másik API, mint ami a kereséshez van használva)
  languages : String[] = ["cs_CZ", "da_DK", "de_CH", "de_DE", "en_US", "el_GR", "es_ES", "fr_FR", "hu_HU", "it_IT", "no_NO", "pl_PL", "pt_PT", "ro_RO", "ru_RU", "sk_SK"];

  // Keresést megvalósító függvény hibakezeléssel. A paraméterként kapott nyelvet és a keresett szót ellenőrzi, hogy érvényes. Ha érvénytelen akkor egy snackbar jelzi.
  async searchSynonym(word: string | undefined, lang: string | undefined) : Promise<Synonyms  | null>{
    if(this.emptyLanguageHandlerSnackbar(lang)){
      return null;
    } 
    if(this.emptyWordHandlerSnackbar(word)){
      return null;
    }
    return this.http.get<Synonyms>(`https://thesaurus.altervista.org/thesaurus/v1?word=${word}&language=${lang}&output=json&key=${this.apiKey}`).toPromise();
  }

  // Visszatér a nyelvek listájával.
  getLanguages(){
    return this.languages;
  }

  // Beállítja a snackbart és megnyitja az átadott üzenettel.
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Értem', {
      duration: 10000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['error']
    });
  }

  // Nyelv ellenőrzésére szolgáló függvény. Amennyiben érvénytelen a kiválasztott érték, akkor egy snackbar jelezni fogja.
  emptyLanguageHandlerSnackbar(lang: string | undefined){
    if(!this.languages.includes(lang!) || lang === undefined){
      this.openSnackBar("Válassz ki egy nyelvet az adott szinonima megtalálásához!");
      return true;
    } 
    return false;
  }
  // Keresett szó ellenőrzésére szolgáló függvény. Amennyiben érvénytelen a kiválasztott érték, akkor egy snackbar jelezni fogja.
  emptyWordHandlerSnackbar(word: string | undefined){
    if(word === null || word === undefined || word === ""){
      this.openSnackBar("A kereséshez kérlek adj meg egy szót!");
      return true;
    }
    return false;
  }
}
