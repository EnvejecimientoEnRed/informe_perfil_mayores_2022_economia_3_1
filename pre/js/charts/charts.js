//Desarrollo de las visualizaciones
import * as d3 from 'd3';
//import { numberWithCommas2 } from './helpers';
//import { getInTooltip, getOutTooltip, positionTooltip } from './modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage, setCustomCanvas, setChartCustomCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42', 
COLOR_ANAG_1 = '#D1834F', 
COLOR_ANAG_2 = '#BF2727', 
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0', 
COLOR_GREY_1 = '#B5ABA4', 
COLOR_GREY_2 = '#64605A', 
COLOR_OTHER_1 = '#B58753', 
COLOR_OTHER_2 = '#731854';

export function initChart(iframe) {
    //Lectura de datos
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_economia_3_2/main/data/pension_media_jubilacion_ccaa.csv', function(error,data) {
        if (error) throw error;

        console.log(data);

        // sort data
        data.sort(function(b, a) {
            return a.jubilacion_pension_media - b.jubilacion_pension_media;
        });

        //Desarrollo del gráfico
        let currentType = 'viz';

        let margin = {top: 10, right: 10, bottom: 80, left: 30},
            width = document.getElementById('viz').clientWidth - margin.left - margin.right,
            height = document.getElementById('viz').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#viz")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        let x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map(function(d) { return d.ccaa; }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0,1500])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        function initViz() {
            // Bars
            svg.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
            .attr('class', 'prueba')
            .attr("x", function(d) { return x(d.ccaa); })
            .attr("y", function(d) { return y(d.jubilacion_pension_media); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.jubilacion_pension_media); })
            .attr("fill", "#69b3a2")
        }

        function animateChart() {

        }

        ///// CAMBIO
        function setChart(type) {
            if(type != currentType) {
                if(type == 'viz') {
                    //Cambiamos color botón
                    document.getElementById('data_map').classList.remove('active');
                    document.getElementById('data_viz').classList.add('active');
                    //Cambiamos gráfico
                    document.getElementById('map').classList.remove('active');
                    document.getElementById('viz').classList.add('active');
                } else {
                    //Cambiamos color botón
                    document.getElementById('data_map').classList.add('active');
                    document.getElementById('data_viz').classList.remove('active');
                    //Cambiamos gráfico
                    document.getElementById('viz').classList.remove('active');
                    document.getElementById('map').classList.add('active');
                }
            }            
        }

        /////
        /////
        // Resto - Chart
        /////
        /////
        initViz();

        document.getElementById('data_viz').addEventListener('click', function() {            
            //Cambiamos gráfico
            setChart('viz');
            //Cambiamos valor actual
            currentType = 'viz';
        });

        document.getElementById('data_map').addEventListener('click', function() {
            //Cambiamos gráfico
            setChart('map');
            //Cambiamos valor actual
            currentType = 'map';
        });

        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        //////
        ///// Resto
        //////

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_economia_3_2','importe_mensual_pensiones');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('importe_mensual_pensiones');

        //Captura de pantalla de la visualización
        setChartCanvas();
        setCustomCanvas();

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            setChartCanvasImage('importe_mensual_pensiones');
            setChartCustomCanvasImage('importe_mensual_pensiones');
        });

        //Altura del frame
        setChartHeight(iframe);        
    });    
}