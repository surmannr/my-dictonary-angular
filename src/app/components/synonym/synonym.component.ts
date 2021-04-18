import { Component, OnInit } from '@angular/core';
import { SynonymService } from 'src/app/services/synonym.service';
import { Synonyms, Synonym } from '../../models/Synonyms';
import * as $ from 'jquery';

@Component({
  selector: 'app-synonym',
  templateUrl: './synonym.component.html',
  styleUrls: ['./synonym.component.css'],
})
export class SynonymComponent implements OnInit {
  constructor(private synonymService: SynonymService) {

    let local = JSON.parse(localStorage.getItem('synonymdata')!);
    this.synonyms = local;
    if(this.synonyms != null)
      this.countOfSynonyms = this.synonyms.length;
  }

  languages: Array<String> = [];

  synonyms : Synonym[] = [];
  countOfSynonyms : number = 0;

  ngOnInit(): void {
    this.languages = this.synonymService.getLanguages().sort((a,b)=>(this.convertToNormalName(a) < this.convertToNormalName(b)) ? -1 : 1);
  }

  // Szinonimakeresést megvalósító függvényt. jQuery-vel lekérdezett bemeneti adatok értéke ellenőrzése, hogy érvényes-e.
  // Ha valamelyik adat érvénytelen, akkor a felhasználónak felugrik egy snackbar, ami figyelmeztet, hogy rosszul van megadva az érték.
  // Ellenőrzés után a találatokat hozzáadja a listához és növeli a számlálót.
  // Ha nem található az adatbázisban, akkor exception-t dob az API, amit lekezel a catch ága a promise-nak.
  async searchSynonym(){
    var lang = $('#lang').val()?.toString();
    this.synonymService.emptyLanguageHandlerSnackbar(lang);

    var word = $('#synonym-word').val()?.toString();
    this.synonymService.emptyWordHandlerSnackbar(word);

    this.synonyms = [];
    this.countOfSynonyms = 0;

    await this.synonymService.searchSynonym(word,lang).then(data => {
      if(data != null){
        data.response.forEach(c => {
          this.synonyms.push(c.list)
          this.countOfSynonyms += 1;
        });
        
      } 
    }).catch(e => this.synonymService.openSnackBar("A keresett szóra nincs találat az adatbázisban!"));
    localStorage.setItem('synonymdata', JSON.stringify(this.synonyms));
  }

  // ["cs_CZ", "da_DK", "de_CH", "de_DE", "en_US", "el_GR", "es_ES", "fr_FR", "hu_HU", "it_IT", "no_NO", "pl_PL", "pt_PT", "ro_RO", "ru_RU", "sk_SK"];
  // Országkód alapján visszaadja a tényleges nevét az országnak.
  convertToNormalName(code: String) {
    switch (code) {
      case 'cs_CZ':
        return 'Cseh';
      case 'da_DK':
        return 'Dán';
      case 'de_CH':
        return 'Svájci német';
      case 'de_DE':
        return 'Német';
      case 'en_US':
        return 'Angol';
      case 'el_GR':
        return 'Görög';
      case 'es_ES':
        return 'Spanyol';
      case 'fr_FR':
        return 'Francia';
      case 'hu_HU':
        return 'Magyar';
      case 'it_IT':
        return 'Olasz';
      case 'no_NO':
        return 'Norvég';
      case 'pl_PL':
        return 'Lengyel';
      case 'pt_PT':
        return 'Portugál';
      case 'ro_RO':
        return 'Román';
      case 'ru_RU':
        return 'Orosz';
      case 'sk_SK':
        return 'Szlovák';
      default:
        return code;
    }
  }
}
