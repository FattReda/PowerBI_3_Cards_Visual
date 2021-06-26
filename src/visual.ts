/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";                 // Importations nécessaires/imports needed

import "core-js/stable";
import "../style/visual.less";
import powerbi from "powerbi-visuals-api";
import { VisualSettings } from "./settings";
import IVisual = powerbi.extensibility.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
    private host: IVisualHost;
    private svg: Selection<SVGElement>;
    private container: Selection<SVGElement>;
    private rect1: Selection<SVGElement>;       // 3 rectangles, chaines de caractères 
    private rect2: Selection<SVGElement>;       // 3 rectangles , strings
    private rect3: Selection<SVGElement>;       // (rect1;rect2;rect3) ...
    private textValue1: Selection<SVGElement>;
    private textValue2: Selection<SVGElement>;
    private textValue3: Selection<SVGElement>;
    private textLabel1: Selection<SVGElement>;
    private textLabel2: Selection<SVGElement>;
    private textLabel3: Selection<SVGElement>;
    private visualSettings: VisualSettings;
    private culture: string;
    constructor(options: VisualConstructorOptions) {                      // init 
        this.host = options.host;
        this.svg = d3.select(options.element)
            .append('svg')
            .classed('visuel1', true);
        this.container = this.svg.append("g")
            .classed('container', true);
        this.rect1 = this.container.append("rect")
            .classed('rect', true);
        this.rect2 = this.container.append("rect")
            .classed('rect', true);
        this.rect3 = this.container.append("rect")
            .classed('rect', true);
        this.textValue1 = this.container.append("text")
            .classed("textValue", true);
        this.textValue2 = this.container.append("text")
            .classed("textValue", true);
        this.textValue3 = this.container.append("text")
            .classed("textValue", true);
        this.textLabel1 = this.container.append("text")
            .classed("textLabel", true);
        this.textLabel2 = this.container.append("text")
            .classed("textLabel", true);
        this.textLabel3 = this.container.append("text")
            .classed("textLabel", true);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    public Display_by_unit(x, decimals) {         // method to format units display
        if (isNaN(x)) return x.toFixed(decimals);

        if (x < 9999) {
            return x.toFixed(decimals);
        }

        if (x < 1000000) {
            return Math.round(x.toFixed(decimals) / 1000) + "K";
        }
        if (x < 10000000) {
            return (x.toFixed(decimals) / 1000000).toFixed(2) + "M";
        }

        if (x < 1000000000) {
            return Math.round((x.toFixed(decimals) / 1000000)) + "M";
        }

        if (x < 1000000000000) {
            return Math.round((x.toFixed(decimals) / 1000000000)) + "B";
        }
        return "1T+";
    }

    public decimal_fix(number, decimals, display_unit, display_percentage) {   //method to format decimals + thousand separator by host culture
        if (display_unit)
            return this.Display_by_unit(number, decimals).toLocaleString(this.culture);
        if (display_percentage)
            return parseFloat((number * 100).toFixed(decimals)).toLocaleString(this.culture) + "%";
        return parseFloat(number.toFixed(decimals)).toLocaleString(this.culture);
    }

    public changeBackground(bElement, bUrl) {   //method to import image from url and size configure
        bElement.style.backgroundSize = "cover";
        return bElement.style.backgroundImage = "url(" + bUrl + ")";
    }

    public preloadImage() {     //method to load image
        this.changeBackground(document.body, this.visualSettings.backgroundSettings.imageURL);
    }

    public removeimage() {      //remove image
        this.container.select("image").remove();
    }

    public update(options: VisualUpdateOptions) {
        /** Test 1: Data view has valid bare-minimum entries **/
        let dataViews = options.dataViews;   //data import
        /*console.log('Test 1: Valid data...');
        if (!dataViews
            || !dataViews[0]
            || !dataViews[0].table
            || !dataViews[0].table.rows                          // if necessary to apply tests
            || !dataViews[0].table.columns                       //check 
            || !dataViews[0].metadata
        ) {
            console.log('Test 1 FAILED.');
            return;
        }*/
        let table = dataViews[0].table;                          // Traitement des données/Processing the dataview
        let width: number = options.viewport.width;              // get visual width/height
        let height: number = options.viewport.height;
        let fontSizeValue: number = Math.min(width, height) / 5;
        let fontSizeLabel: number = fontSizeValue / 4;
        this.svg.attr("width", width);
        this.svg.attr("height", height);
        this.visualSettings = VisualSettings.parse<VisualSettings>(dataViews[0]);
        document.body.style.background = (this.visualSettings.backgroundSettings.show) ? this.visualSettings.backgroundSettings.backgroundColor : "none";                        // fill settings
        (this.visualSettings.backgroundSettings.showImage && this.visualSettings.backgroundSettings.imageURL && this.visualSettings.backgroundSettings.show) ? this.preloadImage() : this.removeimage();
        this.visualSettings.aboutSettings.version = "3.0";        //AboutSettings
        this.visualSettings.aboutSettings.helpUrl = "https://urlz.fr/dEkd";
        this.culture = this.host.locale;                         // get host's locale for locale formatting
        this.textValue1                                        // Setting up textValue 1
            .text(this.visualSettings.fix.Prefix_val1 + " " + this.decimal_fix(table.rows[0][0], this.visualSettings.textValue1Settings.decimalPlaces, this.visualSettings.textValue1Settings.displayUnit, this.visualSettings.textValue1Settings.percentage_format) + " " + this.visualSettings.fix.Postfix_val1)
            .attr("x", "50%")
            .attr("y", "25%")
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("fill", this.visualSettings.textValue1Settings.color)
            .style("font-family", this.visualSettings.textValue1Settings.fontFamily)
            .style("font-size", (this.visualSettings.textValue1Settings.change_font) ? this.visualSettings.textValue1Settings.fontSize : "4vw")
            .style("font-style", this.visualSettings.textValue1Settings.isItalic === true ? "italic" : "normal")
            .style("font-weight", this.visualSettings.textValue1Settings.isBold === true ? "bold" : "normal")
        this.textLabel1                                       // Setting up textlabel 1
            .text(table.columns[0].displayName)
            .attr("x", "50%")
            .attr("y", (this.visualSettings.rect.show) ? "30%" : "35%")
            .attr("dy", fontSizeValue / 1.2)
            .attr("text-anchor", "middle")
            .style("fill", (this.visualSettings.textLabelSettings.show) ? this.visualSettings.textLabelSettings.color : "none")
            .style("font-family", this.visualSettings.textLabelSettings.fontFamily)
            .style("font-size", (this.visualSettings.textLabelSettings.change_font) ? this.visualSettings.textLabelSettings.fontSize : fontSizeLabel + "px")
            .style("font-style", this.visualSettings.textLabelSettings.isItalic === true ? "italic" : "normal")
            .style("font-weight", this.visualSettings.textLabelSettings.isBold === true ? "bold" : "normal")
        this.rect1                                               // Setting up rectangle 1
            .style("fill", (this.visualSettings.rect.show) ? this.visualSettings.rect.rectangleColor : "none")
            .style("fill-opacity", 1 - this.visualSettings.rect.transparency / 100)
            .style("stroke", "black")
            .style("stroke-width", (this.visualSettings.rect.show) ? this.visualSettings.rect.rectangleThickness : 0)
            .attr("x", "25%")
            .attr("y", 0)
            .attr("height", "50%")
            .attr("width", "50%")
            .attr("rx", 15)
            .attr("ry", 15);
        this.textValue2                                      // Setting up textvalue 2
            .text(this.visualSettings.fix.Prefix_val2 + " " + this.decimal_fix(table.rows[0][1], this.visualSettings.textValue2Settings.decimalPlaces, this.visualSettings.textValue2Settings.displayUnit, this.visualSettings.textValue2Settings.percentage_format) + " " + this.visualSettings.fix.Postfix_val2)
            .attr("x", "25%")
            .attr("y", "65%")
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("fill", this.visualSettings.textValue2Settings.color)
            .style("font-family", this.visualSettings.textValue2Settings.fontFamily)
            .style("font-size", (this.visualSettings.textValue2Settings.change_font) ? this.visualSettings.textValue2Settings.fontSize : "4vw")
            .style("font-style", this.visualSettings.textValue2Settings.isItalic === true ? "italic" : "normal")
            .style("font-weight", this.visualSettings.textValue2Settings.isBold === true ? "bold" : "normal")
        this.textLabel2                                      // Setting up textlabel 2
            .text(table.columns[1].displayName)
            .attr("x", "25%")
            .attr("y", "75%")
            .attr("dy", fontSizeValue / 1.2)
            .attr("text-anchor", "middle")
            .style("fill", (this.visualSettings.textLabelSettings.show) ? this.visualSettings.textLabelSettings.color : "none")
            .style("font-family", this.visualSettings.textLabelSettings.fontFamily)
            .style("font-size", (this.visualSettings.textLabelSettings.change_font) ? this.visualSettings.textLabelSettings.fontSize : fontSizeLabel + "px")
            .style("font-style", this.visualSettings.textLabelSettings.isItalic === true ? "italic" : "normal")
            .style("font-weight", this.visualSettings.textLabelSettings.isBold === true ? "bold" : "normal")
        this.rect2                                           // Setting up rectangle 2
            .style("fill", (this.visualSettings.rect.show) ? this.visualSettings.rect.rectangleColor : "none")
            .style("fill-opacity", 1 - this.visualSettings.rect.transparency / 100)
            .style("stroke", "black")
            .style("stroke-width", (this.visualSettings.rect.show) ? this.visualSettings.rect.rectangleThickness : 0)
            .attr("x", "0%")
            .attr("y", "50%")
            .attr("height", "50%")
            .attr("width", "50%")
            .attr("rx", 15)
            .attr("ry", 15);
        this.textValue3                                      // Setting up textvalue 3
            .text(this.visualSettings.fix.Prefix_val3 + " " + this.decimal_fix(table.rows[0][2], this.visualSettings.textValue3Settings.decimalPlaces, this.visualSettings.textValue3Settings.displayUnit, this.visualSettings.textValue3Settings.percentage_format) + " " + this.visualSettings.fix.Postfix_val3)
            .attr("x", "75%")
            .attr("y", "65%")
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("fill", this.visualSettings.textValue3Settings.color)
            .style("font-family", this.visualSettings.textValue3Settings.fontFamily)
            .style("font-size", (this.visualSettings.textValue3Settings.change_font) ? this.visualSettings.textValue3Settings.fontSize : "4vw")
            .style("font-style", this.visualSettings.textValue3Settings.isItalic === true ? "italic" : "normal")
            .style("font-weight", this.visualSettings.textValue3Settings.isBold === true ? "bold" : "normal")
        this.textLabel3                                      // Setting up textlabel 3
            .text(table.columns[2].displayName)
            .attr("x", "75%")
            .attr("y", "75%")
            .attr("dy", fontSizeValue / 1.2)
            .attr("text-anchor", "middle")
            .style("fill", (this.visualSettings.textLabelSettings.show) ? this.visualSettings.textLabelSettings.color : "none")
            .style("font-family", this.visualSettings.textLabelSettings.fontFamily)
            .style("font-size", (this.visualSettings.textLabelSettings.change_font) ? this.visualSettings.textLabelSettings.fontSize : fontSizeLabel + "px")
            .style("font-style", this.visualSettings.textLabelSettings.isItalic === true ? "italic" : "normal")
            .style("font-weight", this.visualSettings.textLabelSettings.isBold === true ? "bold" : "normal")
        this.rect3                                          // Setting up rectangle 3
            .style("fill", (this.visualSettings.rect.show) ? this.visualSettings.rect.rectangleColor : "none")
            .style("fill-opacity", 1 - this.visualSettings.rect.transparency / 100)
            .style("stroke", "black")
            .style("stroke-width", (this.visualSettings.rect.show) ? this.visualSettings.rect.rectangleThickness : 0)
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("height", "50%")
            .attr("width", "50%")
            .attr("rx", 15)
            .attr("ry", 15);
    }
}