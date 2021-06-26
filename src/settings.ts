/*
 *  Power BI Visualizations
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

"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;



export class VisualSettings extends DataViewObjectsParser {
  public rect: RectangleSettings = new RectangleSettings();
  public backgroundSettings = new FillSettings(); 
  public textValue1Settings = new TextValue1Settings();
  public textValue2Settings = new TextValue2Settings();
  public textValue3Settings = new TextValue3Settings();
  public textLabelSettings = new TextLabelSettings();
  public fix = new Fix();
  public aboutSettings = new AboutSettings();
}


export class RectangleSettings {
  public show: boolean = false;
  public rectangleColor: string = "LightGray";
  public transparency: number = 0.5;
  public rectangleThickness: number = 5;
}

export class FillSettings {
  public show: boolean = false;
  public backgroundColor: string = "#808080";
  public showImage: boolean = false;
  public imageURL: string = null;
}

export class TextValue1Settings  {
  public color: string = "#333333";
  public percentage_format: boolean = false;
  public displayUnit: boolean = false;
  public decimalPlaces: number = 2;
  public change_font: boolean = false;
  public fontSize: number = 50;
  public fontFamily: string = "wf_standard-font, helvetica, arial, sans-serif";
  public isBold: boolean = false;
  public isItalic: boolean = false;
}

export class TextValue2Settings  {
  public color: string = "#333333";
  public percentage_format: boolean = false;
  public displayUnit: boolean = false;
  public decimalPlaces: number = 2;
  public change_font: boolean = false;
  public fontSize: number = 45;
  public fontFamily: string = "wf_standard-font, helvetica, arial, sans-serif";
  public isBold: boolean = false;
  public isItalic: boolean = false;
}

export class TextValue3Settings  {
  public color: string = "#333333";
  public percentage_format: boolean = false;
  public displayUnit: boolean = false;
  public decimalPlaces: number = 2;
  public change_font: boolean = false;
  public fontSize: number = 45;
  public fontFamily: string = "wf_standard-font, helvetica, arial, sans-serif";
  public isBold: boolean = false;
  public isItalic: boolean = false;
}

export class TextLabelSettings {
  public show: boolean = true;
  public color: string = "#a6a6a6";
  public change_font : boolean = false;
  public fontSize: number = 20;
  public fontFamily: string = "\"Segoe UI\", wf_segoe-ui_normal, helvetica, arial, sans-serif";
  public isBold: boolean = false;
  public isItalic: boolean = false;
}

export class Fix {
  public show: boolean = true;
  public Prefix_val1: string ="";
  public Postfix_val1: string ="";
  public Prefix_val2: string ="";
  public Postfix_val2: string ="";
  public Prefix_val3: string ="";
  public Postfix_val3: string ="";
}

export class AboutSettings {
  public version: string = "3.0";
  public helpUrl: string = "https://urlz.fr/dEkd";
}