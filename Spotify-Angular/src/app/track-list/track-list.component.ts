import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent implements OnInit {

  results;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  showTracks() {
    this.results = this._spotifyService.searchResults;

    console.log('RESULTS','\n',this.results);
  }

}
