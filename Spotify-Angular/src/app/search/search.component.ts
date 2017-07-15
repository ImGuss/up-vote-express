import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query: string;
  type: string;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  searchType() {
    console.log(this.type);
  }

  searchTrack() {
    this._spotifyService.searchTrack(this.query, this.type).subscribe( (res) => {
      this._spotifyService.searchResults = res.tracks.items;
      console.log(res.tracks.items);
    });
  }

}
