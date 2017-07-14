import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query: string;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  searchTrack() {
    this._spotifyService.searchTrack(this.query).subscribe( (res) => {
      console.log(res.tracks.items);
    });
  }

  // getAuthorization() {
  //   this._spotifyService.getAuthorization().subscribe( (res) => {
  //     console.log(res);
  //   });
  // }

}
