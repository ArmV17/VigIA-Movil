import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MapaPage implements AfterViewInit {
  map!: mapboxgl.Map;
  todosLosDestinos: any[] = [];
  markerA: mapboxgl.Marker | null = null;
  markerB: mapboxgl.Marker | null = null;
  
  // Tu Token Personal
  private readonly MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FsdmFoZHotMTEiLCJhIjoiY2x3czBoYTJiMDI1OTJqb2VmZzVueG1ocCJ9.dDJweS7MAR5N2U3SF64_Xw';
  readonly CENTER_COORDS: [number, number] = [-100.93655, 25.55701];

  // Variables sincronizadas con tu HTML
  panelVisible = false;
  currentTitle = '';
  currentText = '';
  currentImg = '';

  constructor() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  initMap() {
    // 🔥 SOLUCIÓN AL ERROR DE INMUTABILIDAD (Línea 36):
    // Usamos 'as any' para que TypeScript nos permita asignar el token
    (mapboxgl as any).accessToken = this.MAPBOX_TOKEN; 

    this.map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/mapbox/dark-v11',
      center: this.CENTER_COORDS,
      zoom: 16,
      pitch: 45
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    this.map.on('load', () => {
      this.map.resize();
      this.cargarDatosYCapas();
      this.configurarListenersRuta();
    });
  }

  async cargarDatosYCapas() {
    try {
      const [resEdificios, resMarkers] = await Promise.all([
        fetch('assets/data/edificios.json'),
        fetch('assets/data/markers.json')
      ]);
      
      const edificiosData = await resEdificios.json();
      const markersData = await resMarkers.json();
      this.todosLosDestinos = [...edificiosData, ...markersData];

      const selectOrigen = document.getElementById('origen') as HTMLSelectElement;
      const selectDestino = document.getElementById('destino') as HTMLSelectElement;
      const features: any[] = [];

      this.todosLosDestinos.forEach(lugar => {
        if (lugar.door_coords) {
          selectOrigen.add(new Option(lugar.nombre, lugar.nombre));
          selectDestino.add(new Option(lugar.nombre, lugar.nombre));
        }

        if (lugar.polygons && lugar.polygons[0]) {
          const coords = [...lugar.polygons];
          if (coords[0][0] !== coords[coords.length - 1][0]) coords.push(coords[0]);
          
          features.push({
            type: 'Feature',
            properties: { nombre: lugar.nombre, color: lugar.color || '#444444' },
            geometry: { type: 'Polygon', coordinates: [coords] }
          });
        }
      });

      this.map.addSource('lugares', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: features }
      });

      this.map.addLayer({
        id: 'lugares-layer',
        type: 'fill',
        source: 'lugares',
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.6 }
      });

      this.configurarClicksMapa();
    } catch (e) { console.error(e); }
  }

  configurarListenersRuta() {
    const sO = document.getElementById('origen') as HTMLSelectElement;
    const sD = document.getElementById('destino') as HTMLSelectElement;
    const btn = document.getElementById('btnResetRuta');

    if (sO && sD) {
      const update = () => this.calcularRuta(sO.value, sD.value);
      sO.onchange = update;
      sD.onchange = update;
    }

    if (btn) {
      btn.onclick = () => {
        if (this.map.getLayer('ruta')) { this.map.removeLayer('ruta'); this.map.removeSource('ruta'); }
        if (this.markerA) this.markerA.remove();
        if (this.markerB) this.markerB.remove();
        sO.value = 'GPS';
        sD.selectedIndex = 0;
        this.map.flyTo({ center: this.CENTER_COORDS, zoom: 16 });
      };
    }
  }

  async calcularRuta(origen: string, destino: string) {
    if (!origen || !destino || origen === destino) return;
    const dObj = this.todosLosDestinos.find(d => d.nombre === destino);
    if (!dObj) return;

    if (origen === "GPS") {
      navigator.geolocation.getCurrentPosition(pos => {
        this.ejecutarPeticionRuta([pos.coords.longitude, pos.coords.latitude], dObj.door_coords);
      }, () => alert("⚠️ Activa tu GPS"));
    } else {
      const oObj = this.todosLosDestinos.find(o => o.nombre === origen);
      if (oObj) this.ejecutarPeticionRuta(oObj.door_coords, dObj.door_coords);
    }
  }

  async ejecutarPeticionRuta(start: [number, number], end: [number, number]) {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${this.MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json.routes[0]) return;

      if (this.map.getSource('ruta')) {
        (this.map.getSource('ruta') as mapboxgl.GeoJSONSource).setData(json.routes[0].geometry);
      } else {
        // properties: {} es obligatorio para el tipo Feature
        this.map.addLayer({
          id: 'ruta',
          type: 'line',
          source: { 
            type: 'geojson', 
            data: { type: 'Feature', properties: {}, geometry: json.routes[0].geometry } 
          },
          paint: { 'line-color': '#00b4d8', 'line-width': 6 }
        });
      }

      if (this.markerA) this.markerA.remove();
      if (this.markerB) this.markerB.remove();
      this.markerA = new mapboxgl.Marker().setLngLat(start).addTo(this.map);
      this.markerB = new mapboxgl.Marker().setLngLat(end).addTo(this.map);
      this.map.fitBounds(new mapboxgl.LngLatBounds(start, start).extend(end), { padding: 50 });
    } catch (e) { console.error(e); }
  }

  configurarClicksMapa() {
    this.map.on('click', 'lugares-layer', (e) => {
      const name = e.features![0].properties!['nombre'];
      const item = this.todosLosDestinos.find(x => x.nombre === name);
      if (!item) return;
      this.currentTitle = name;
      this.currentText = item.informacion || 'Sin info.';
      this.currentImg = item.imagen ? `assets/imgs/img/${item.imagen}` : `assets/imgs/img/db_mapa_default.webp`;
      this.panelVisible = true;
    });
  }

  closeInfoPanel() { this.panelVisible = false; }
}