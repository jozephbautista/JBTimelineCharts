// =====================================================
// Author: Jozeph Bautista
// LinkedIn: https://www.linkedin.com/in/jozephbautista/
// GitHub: https://github.com/jozephbautista
// =====================================================

function renderChart(properties, data) {
    if (properties.canvasType == "Standard") {
        buildChartStandard(properties, data);
    }
    else if (properties.canvasType == "ProductLifecycle") {
        buildChartProductLifecycle(properties, data);
    }
    else if (properties.canvasType == "NewsReview") {
        buildChartNewsReview(properties, data);
    }
}

function buildChartStandard(properties, timelineData) {

    // Init canvas
    var canvas = document.getElementById(properties.canvasId);
    var p = properties;

    canvas.width = p.canvasWidth;
    canvas.height = p.canvasHeight;
    var CTX = canvas.getContext('2d');
    CTX.clearRect(0, 0, p.canvasWidth, p.canvasHeight); // Clears canvas, useful for animation
    CTX.fillStyle = p.canvasBackgroundColor;
    CTX.fillRect(0, 0, p.canvasWidth, p.canvasHeight);

    // Render timeline bar
    var monthX = p.timelineBarX;
    var monthY = p.timelineBarY + p.timeLineBarMonthOffsetY;
    p.timeLineBarMonthWidth = p.timeLineBarMonthWidth + p.timeLineBarMonthSpacer;
    for (var m = 0; m < monthsArray.length; m++) {
        CTX.fillStyle = p.timeLineBarBGColor;
        CTX.fillRect(p.timelineBarX + (m * p.timeLineBarMonthWidth), p.timelineBarY, p.timeLineBarMonthWidth - p.timeLineBarMonthSpacer, p.timeLineBarHeight); // x, y, width, height
        CTX.stroke();
        CTX.font = p.timeLineBarMonthFont;
        CTX.fillStyle = p.timeLineBarMonthColor;
        var monthtextleftoffset = ((p.timeLineBarMonthWidth - p.timeLineBarMonthSpacer) - CTX.measureText(monthsArray[m]).width) / 2; // To center the text within 180px width
        CTX.fillText(monthsArray[m], monthX + monthtextleftoffset, monthY);
        monthX += p.timeLineBarMonthWidth;
    }

    // Render legend section
    //Border
    CTX.beginPath();
    CTX.moveTo(p.legendSectionX, p.legendSectionY);
    CTX.rect(p.legendSectionX, p.legendSectionY, p.legendSectionWidth, p.legendSectionHeight);
    CTX.strokeStyle = p.legendContainerBorderColor;
    CTX.stroke();
    //Header
    CTX.font = "Bold 12px Segoe UI";
    CTX.fillStyle = '#333333';
    var legendTitle = p.legendTitleText;
    var legendTitleOffset = ((p.legendSectionWidth - CTX.measureText(legendTitle).width) / 2);
    CTX.fillText(legendTitle, p.legendSectionX + legendTitleOffset, p.legendSectionY + 20);
    //Text
    CTX.font = "12px Segoe UI";
    CTX.fillText(eventtypes.KEYMOMENT, p.legendSectionX + 45, p.legendSectionY + 50);
    CTX.fillText(eventtypes.RELEASEMILESTONE, p.legendSectionX + 45, p.legendSectionY + 80);
    CTX.fillText(eventtypes.FIRSTPARTYEVENT, p.legendSectionX + 190, p.legendSectionY + 50);
    CTX.fillText(eventtypes.THIRDPARTYEVENT, p.legendSectionX + 190, p.legendSectionY + 80);
    //Icons
    CTX.beginPath();
    CTX.lineWidth = 1;
    drawStar(CTX, p, p.legendSectionX + 26, p.legendSectionY + 45, 5, 10, 5); // Star
    CTX.beginPath();
    CTX.strokeStyle = p.releaseMilestoneFontColor;
    CTX.rect(p.legendSectionX + 10, p.legendSectionY + 65, 30, 20); // Release Milestone (rectangle)
    CTX.stroke();
    CTX.beginPath();
    CTX.arc(p.legendSectionX + 180, p.legendSectionY + 45, 5, 0, Math.PI * 2, false); // 1st Party Event
    CTX.fillStyle = p.datapointCircleFillColor;
    CTX.fill();
    CTX.lineWidth = 1;
    CTX.strokeStyle = p.datapointCircleBorderColor;
    CTX.stroke();
    CTX.beginPath();
    CTX.arc(p.legendSectionX + 180, p.legendSectionY + 75, 5, 0, Math.PI * 2, false); // 3rd Party Event
    CTX.lineWidth = 1;
    CTX.strokeStyle = p.datapointCircleBorderColor;
    CTX.stroke();

    // Count how many events per month
    function MonthCount(month, count) {
        this.Month = month;
        this.count = count;
    };
    var MonthCountArray = [];

    for (var m = 0; m < monthsArray.length; m++) {

        var count = 0;
        for (var e = 0; e < timelineData.length; e++) {
            if (monthsArray[m] == timelineData[e].month) {
                count++;
            }
        }

        MonthCountArray.push(new MonthCount(monthsArray[m], count));
    }

    // Iterate and render data for each month
    // Rule: Render only the first 4 events of a month
    var datapointlist = [];
    var eventtypelist = [];
    for (var m = 0; m < MonthCountArray.length; m++) {

        // This will compress the data items towards the center of each month.
        // Set narrowMonthEdgePadding to zero so that there is no padding left and right, making the data items spread out evenly across 180 pixels.
        var narrowMonthEdgePadding = 35;
        var narrowMonthWidth = p.timeLineBarMonthWidth - (narrowMonthEdgePadding * 2);

        var MonthDataPointOffsetX = narrowMonthWidth / (MonthCountArray[m].count + 1);
        if (MonthCountArray[m].count >= p.maxDataPointPerMonth) {
            MonthDataPointOffsetX = narrowMonthWidth / (p.maxDataPointPerMonth + 1);
        }

        var lineLength = 0;
        var lineLengthStep = 100;

        var count = 0;
        for (var e = 0; e < timelineData.length; e++) {
            if (monthsArray[m] == timelineData[e].month) {
                count++;

                var lineBottomPadding = 50;
                if (count <= p.maxDataPointPerMonth) {

                    var DatapointPerMonth = MonthCountArray[m].count > 4 ? 4 : MonthCountArray[m].count;
                    lineLength = (lineBottomPadding + (DatapointPerMonth * lineLengthStep)) - (lineLengthStep * count);

                    // line
                    CTX.beginPath();
                    CTX.lineWidth = 2;
                    CTX.moveTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY);
                    CTX.lineTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY - lineLength);
                    CTX.strokeStyle = p.datapointLineColor;
                    CTX.stroke();

                    // circle
                    if (timelineData[e].eventtype == eventtypes.FIRSTPARTYEVENT) {
                        CTX.beginPath();
                            const datapoint = new Path2D();
                            datapoint.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), (p.timelineBarY - lineLength) - 5, 5, 0, Math.PI * 2, false);
                        CTX.fillStyle = p.datapointCircleFillColor;
                        CTX.lineWidth = 1;
                        CTX.strokeStyle = p.datapointCircleBorderColor;
                        CTX.fill(datapoint);
                        CTX.stroke(datapoint);
                        datapointlist.push(datapoint);
                        eventtypelist.push(eventtypes.FIRSTPARTYEVENT);
                    }
                    else if (timelineData[e].eventtype == eventtypes.THIRDPARTYEVENT) {
                        CTX.beginPath();
                            const datapoint = new Path2D();
                            datapoint.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), (p.timelineBarY - lineLength) - 5, 5, 0, Math.PI * 2, false);
                        CTX.fillStyle = "#ffffff";
                        CTX.lineWidth = 1;
                        CTX.strokeStyle = p.datapointCircleBorderColor;
                        CTX.fill(datapoint);
                        CTX.stroke(datapoint);
                        datapointlist.push(datapoint);
                        eventtypelist.push(eventtypes.THIRDPARTYEVENT);
                    }

                    // star
                    if ((timelineData[e].badgetype == badgetypes.KEYMOMENT) || (timelineData[e].badgetype == badgetypes.ALL)) {
                        drawStar(CTX, p, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 20, (p.timelineBarY - lineLength) - 45, 5, 10, 5);
                    }

                    // date
                    CTX.font = p.datapointDateFont;
                    CTX.fillStyle = p.datapointDateColor;
                    CTX.fillText(timelineData[e].eventdaterange, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, (p.timelineBarY - lineLength) - 20);

                    // title
                    CTX.font = p.datapointTitleFont;
                    CTX.fillStyle = p.datapointTitleColor;

                    // get title width
                    var titlemetrics = CTX.measureText(timelineData[e].eventdaterange);
                    var textobj = wrapText(CTX, timelineData[e].title, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, (p.timelineBarY - lineLength) - 2, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

                    var rect_width = titlemetrics.width;
                    if (textobj.maxwidth > titlemetrics.width) {
                        rect_width = textobj.maxwidth;
                    }

                    if (timelineData[e].badgetype == badgetypes.RELEASEMILESTONE || timelineData[e].badgetype == badgetypes.ALL) {
                        // Rectangle border
                        CTX.beginPath();
                        CTX.lineWidth = 1;
                        CTX.strokeStyle = p.releaseMilestoneFontColor;
                        CTX.rect((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 7, (p.timelineBarY - lineLength) - 32, rect_width + 5, textobj.yaxis - (p.timelineBarY - lineLength) + 37);
                        CTX.stroke();
                    }

                }

            }
        }
    }

    // Event listener for hover/highlight on each datapoint
    canvas.addEventListener('mousemove', function (event) {
        event = event || window.event;
        for (var i = datapointlist.length - 1; i >= 0; i--) {

            if (datapointlist[i] && CTX.isPointInPath(datapointlist[i], event.offsetX, event.offsetY)) {
                //Hover over datapoint
                canvas.style.cursor = 'pointer';
                //CTX.beginPath();
                //CTX.fillStyle = 'yellow';
                //CTX.lineWidth = 1;
                //CTX.strokeStyle = p.datapointCircleBorderColor;
                //CTX.fill(datapointlist[i]);
                //CTX.stroke(datapoint[i]);
                return
            } else {
                //Default when not in hover
                canvas.style.cursor = 'default';
                //for (var d = datapointlist.length - 1; d >= 0; d--) {
                //    CTX.beginPath();
                //    if (eventtypelist[d] == eventtypes.FIRSTPARTYEVENT) {
                //        CTX.fillStyle = p.datapointCircleFillColor;
                //    }
                //    else {
                //        CTX.fillStyle = '#ffffff';
                //    }
                //    CTX.lineWidth = 1;
                //    CTX.strokeStyle = p.datapointCircleBorderColor;
                //    CTX.fill(datapointlist[d]);
                //    CTX.stroke(datapointlist[d]);
                //}
            }
        }
    });

    // Clickable links
    var links = ['http://YouTube.com', 'http://Yahoo.com', 'http://msn.com', 'http://bing.com', 'http://espn.com', 'http://microsoft.com', 'http://tesla.com', 'http://att.com', 'http://coke.com', 'http://pepsi.com', 'http://yeti.com'];
    
    canvas.addEventListener('mousedown', function (event) {
        event = event || window.event;
        for (var i = datapointlist.length - 1; i >= 0; i--) {
            if (datapointlist[i] && CTX.isPointInPath(datapointlist[i], event.offsetX, event.offsetY)) {
                //Click action on a datapoint
                window.open(links[i]);
                return
            }
        }
    });
}

function buildChartNewsReview(properties, timelineData) {

    // Init canvas
    var canvas = document.getElementById(properties.canvasId);
    var p = properties;

    canvas.width = p.canvasWidth;
    canvas.height = p.canvasHeight;
    var CTX = canvas.getContext('2d');
    CTX.clearRect(0, 0, p.canvasWidth, p.canvasHeight); // Clears canvas, useful for animation
    CTX.fillStyle = p.canvasBackgroundColor;
    CTX.fillRect(0, 0, p.canvasWidth, p.canvasHeight);

    // Render timeline bar
    var monthX = p.timelineBarX;
    var monthY = p.timelineBarY + p.timeLineBarMonthOffsetY;

    p.timeLineBarMonthWidth = p.timeLineBarMonthWidth + p.timeLineBarMonthSpacer;
    for (var m = 0; m < monthsArray.length; m++) {
        CTX.fillStyle = p.timeLineBarBGColor;
        CTX.fillRect(p.timelineBarX + (m * p.timeLineBarMonthWidth), p.timelineBarY, p.timeLineBarMonthWidth - p.timeLineBarMonthSpacer, p.timeLineBarHeight); // x, y, width, height
        CTX.stroke();
        CTX.font = p.timeLineBarMonthFont;
        CTX.fillStyle = p.timeLineBarMonthColor;
        var monthtextleftoffset = ((p.timeLineBarMonthWidth - p.timeLineBarMonthSpacer) - CTX.measureText(monthsArray[m]).width) / 2; // To center the text within 180px width
        CTX.fillText(monthsArray[m], monthX + monthtextleftoffset, monthY);
        monthX += p.timeLineBarMonthWidth;
    }

    // Render legend section
    //Border
    CTX.beginPath();
    CTX.moveTo(p.legendSectionX, p.legendSectionY);
    CTX.rect(p.legendSectionX, p.legendSectionY, p.legendSectionWidth, p.legendSectionHeight);
    CTX.strokeStyle = p.legendContainerBorderColor;
    CTX.stroke();
    //Header
    CTX.font = "Bold 12px Segoe UI";
    CTX.fillStyle = '#333333';
    var legendTitle = p.legendTitleText;
    var legendTitleOffset = ((p.legendSectionWidth - CTX.measureText(legendTitle).width) / 2);
    CTX.fillText(legendTitle, p.legendSectionX + legendTitleOffset, p.legendSectionY + 20);
    //Text
    CTX.font = "12px Segoe UI";
    CTX.fillText(eventtypes_NewsReview.KEYMOMENT, p.legendSectionX + 45, p.legendSectionY + 50);
    CTX.fillText(eventtypes_NewsReview.PRBEAT, p.legendSectionX + 45, p.legendSectionY + 80);
    CTX.fillText(eventtypes_NewsReview.FIRSTPARTYEVENT, p.legendSectionX + 190, p.legendSectionY + 50);
    CTX.fillText(eventtypes_NewsReview.THIRDPARTYEVENT, p.legendSectionX + 190, p.legendSectionY + 80);
    //Icons
    CTX.beginPath();
    CTX.lineWidth = 1;
    drawStar(CTX, p, p.legendSectionX + 26, p.legendSectionY + 45, 5, 10, 5); // Star
    CTX.beginPath();
    CTX.strokeStyle = p.prBeatFontColor;
    CTX.rect(p.legendSectionX + 10, p.legendSectionY + 65, 30, 20); // PR Beat (rectangle)
    CTX.stroke();
    CTX.beginPath();
    CTX.arc(p.legendSectionX + 180, p.legendSectionY + 45, 5, 0, Math.PI * 2, false); // 1st Party Event
    CTX.fillStyle = p.datapointCircleFillColor;
    CTX.fill();
    CTX.lineWidth = 1;
    CTX.strokeStyle = p.datapointCircleBorderColor;
    CTX.stroke();
    CTX.beginPath();
    CTX.arc(p.legendSectionX + 180, p.legendSectionY + 75, 5, 0, Math.PI * 2, false); // 3rd Party Event
    CTX.lineWidth = 1;
    CTX.strokeStyle = p.datapointCircleBorderColor;
    CTX.stroke();

    // Count how many events per month
    function MonthCount(month, count) {
        this.Month = month;
        this.count = count;
    };
    var MonthCountArray = [];

    for (var m = 0; m < monthsArray.length; m++) {

        var count = 0;
        for (var e = 0; e < timelineData.length; e++) {
            if (monthsArray[m] == timelineData[e].month) {
                count++;
            }
        }

        MonthCountArray.push(new MonthCount(monthsArray[m], count));
    }

    // Iterate and render data for each month
    // Rule: Render only the first 4 events of a month
    for (var m = 0; m < MonthCountArray.length; m++) {

        // This will compress the data items towards the center of each month.
        // Set narrowMonthEdgePadding to zero so that there is no padding left and right, making the data items spread out evenly across 180 pixels.
        var narrowMonthEdgePadding = 50;
        var narrowMonthWidth = p.timeLineBarMonthWidth - (narrowMonthEdgePadding * 2);

        var MonthDataPointOffsetX = narrowMonthWidth / (MonthCountArray[m].count + 1);
        if (MonthCountArray[m].count >= p.maxDataPointPerMonth) {
            MonthDataPointOffsetX = narrowMonthWidth / (p.maxDataPointPerMonth + 1);
        }

        var lineOnTop = true;
        var lineLength = 0;
        var lineLengthStep = 45;

        var count = 0;
        for (var e = 0; e < timelineData.length; e++) {
            if (monthsArray[m] == timelineData[e].month) {
                count++;

                var monthMaxCount = MonthCountArray[m].count < 9 ? MonthCountArray[m].count : p.maxDataPointPerMonth;
                var linePadding = 40;

                if (lineOnTop == true) {
                    if (count <= p.maxDataPointPerMonth) {

                        if (monthMaxCount < 3) {
                            lineLength = linePadding;
                        } else {
                            lineLength = ((lineLengthStep * monthMaxCount)) - (lineLengthStep * count);
                        }

                        // line
                        CTX.beginPath();
                        CTX.lineWidth = 2;
                        CTX.moveTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY);
                        CTX.lineTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY - lineLength);
                        CTX.strokeStyle = p.datapointLineColor;
                        CTX.stroke();

                        if (timelineData[e].eventtype == eventtypes_NewsReview.FIRSTPARTYEVENT) {
                            CTX.beginPath();
                            CTX.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), (p.timelineBarY - lineLength) - 5, 5, 0, Math.PI * 2, false);
                            CTX.fillStyle = p.datapointCircleFillColor;
                            CTX.fill();
                            CTX.lineWidth = 1;
                            CTX.strokeStyle = p.datapointCircleBorderColor;
                            CTX.stroke();
                        }
                        else if (timelineData[e].eventtype == eventtypes_NewsReview.THIRDPARTYEVENT) {
                            CTX.beginPath();
                            CTX.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), (p.timelineBarY - lineLength) - 5, 5, 0, Math.PI * 2, false);
                            CTX.fillStyle = "#ffffff";
                            CTX.fill();
                            CTX.lineWidth = 1;
                            CTX.strokeStyle = p.datapointCircleBorderColor;
                            CTX.stroke();
                        }

                        // star
                        if ((timelineData[e].badgetype == badgetypes_NewsReview.KEYMOMENT) || (timelineData[e].badgetype == badgetypes_NewsReview.ALL)) {
                            drawStar(CTX, p, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 20, (p.timelineBarY - lineLength) - 45, 5, 10, 5);
                        }

                        // date
                        CTX.font = p.datapointDateFont;
                        CTX.fillStyle = p.datapointDateColor;
                        CTX.fillText(timelineData[e].eventdaterange, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, (p.timelineBarY - lineLength) - 20);

                        // title
                        CTX.font = p.datapointTitleFont;
                        CTX.fillStyle = p.datapointTitleColor;

                        // get title width
                        var titlemetrics = CTX.measureText(timelineData[e].eventdaterange);

                        var textobj = wrapText(CTX, timelineData[e].title, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, (p.timelineBarY - lineLength) - 2, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

                        var rect_width = titlemetrics.width;
                        if (textobj.maxwidth > titlemetrics.width) {
                            rect_width = textobj.maxwidth;
                        }

                        if (timelineData[e].badgetype == badgetypes_NewsReview.PRBEAT || timelineData[e].badgetype == badgetypes_NewsReview.ALL) {
                            // Rectangle border
                            CTX.beginPath();
                            CTX.lineWidth = 1;
                            CTX.strokeStyle = p.prBeatFontColor;
                            CTX.rect((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 7, (p.timelineBarY - lineLength) - 32, rect_width + 5, textobj.yaxis - (p.timelineBarY - lineLength) + 37);
                            CTX.stroke();
                        }
                    }

                    lineOnTop = false;
                }
                else {
                    if (count <= p.maxDataPointPerMonth) {

                        if (monthMaxCount < 3) {
                            lineLength = linePadding * 2;
                        } else {
                            lineLength = (linePadding + (lineLengthStep * monthMaxCount)) - (lineLengthStep * (count - 1));
                        }

                        // line
                        CTX.beginPath();
                        CTX.lineWidth = 2;
                        CTX.moveTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY + p.timeLineBarHeight);
                        CTX.lineTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), (p.timelineBarY + p.timeLineBarHeight) + lineLength);
                        CTX.strokeStyle = p.datapointLineColor;
                        CTX.stroke();

                        // circle
                        if (timelineData[e].eventtype == eventtypes_NewsReview.FIRSTPARTYEVENT) {
                            CTX.beginPath();
                            CTX.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 5, 5, 0, Math.PI * 2, false);
                            CTX.fillStyle = p.datapointCircleFillColor;
                            CTX.fill();
                            CTX.lineWidth = 1;
                            CTX.strokeStyle = p.datapointCircleBorderColor;
                            CTX.stroke();
                        }
                        else if (timelineData[e].eventtype == eventtypes_NewsReview.THIRDPARTYEVENT) {
                            CTX.beginPath();
                            CTX.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 5, 5, 0, Math.PI * 2, false);
                            CTX.fillStyle = "#ffffff";
                            CTX.fill();
                            CTX.lineWidth = 1;
                            CTX.strokeStyle = p.datapointCircleBorderColor;
                            CTX.stroke();
                        }

                        // star
                        if (timelineData[e].eventtype == eventtypes_NewsReview.KEYMOMENT || timelineData[e].badgetype == badgetypes_NewsReview.ALL) {
                            drawStar(CTX, p, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 20, ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 45, 5, 10, 5);
                        }

                        // date
                        CTX.font = p.datapointDateFont;
                        CTX.fillStyle = p.datapointDateColor;
                        CTX.fillText(timelineData[e].eventdaterange, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 20);

                        // title
                        CTX.font = p.datapointTitleFont;
                        CTX.fillStyle = p.datapointTitleColor;

                        // get title width
                        var titlemetrics = CTX.measureText(timelineData[e].eventdaterange);
                        var textobj = wrapText(CTX, timelineData[e].title, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 2, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);
                        var rect_width = titlemetrics.width;
                        if (textobj.maxwidth > titlemetrics.width) {
                            rect_width = textobj.maxwidth;
                        }

                        if (timelineData[e].badgetype == eventtypes_NewsReview.PRBEAT || timelineData[e].badgetype == badgetypes_NewsReview.ALL) {
                            // Rectangle border
                            CTX.beginPath();
                            CTX.lineWidth = 1;
                            CTX.strokeStyle = p.prBeatFontColor;
                            CTX.rect((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 7, ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 32, rect_width + 5, textobj.yaxis - ((p.timelineBarY + p.timeLineBarHeight) + lineLength) + 37);
                            CTX.stroke();
                        }                    }

                    lineOnTop = true;
                }

            }
        }
    }
}

function buildChartProductLifecycle(properties, timelineData) {
    // Init canvas
    var canvas = document.getElementById(properties.canvasId);
    var p = properties;

    canvas.width = p.canvasWidth;
    canvas.height = p.canvasHeight;
    var CTX = canvas.getContext('2d');
    CTX.clearRect(0, 0, p.canvasWidth, p.canvasHeight); // Clears canvas, useful for animation
    CTX.fillStyle = p.canvasBackgroundColor;
    CTX.fillRect(0, 0, p.canvasWidth, p.canvasHeight);

    // Render timeline bar
    CTX.fillStyle = p.timeLineBarBGColor;
    CTX.fillRect(p.timelineBarX, p.timelineBarY, p.timelineBarWidth, p.timeLineBarHeight); // x, y, width, height

    // Iterate and render data
    var DataPointOffsetX = p.timelineBarWidth / (timelineData.length + 1);

    var count = 0;
    var lineLength = 0;
    var lineOnTop = true;
    for (var m = 0; m < timelineData.length; m++) {
        count++;

        // Get how many lines when the title wraps. wrapText end parameter is false = no actual render
        var titleObj = wrapText(CTX, timelineData[m].title, 0, 0, p.datapointTextWrapLimit, p.datapointTitleLineHeight, false);
        var dateObj = wrapText(CTX, timelineData[m].eventdaterange, 0, 0, p.datapointTextWrapLimit, false);
        var innovationCount = 0;
        for (var i = 0; i < timelineData[m].innovations.length; i++) {
            var innovationObj = wrapText(CTX, "• " + timelineData[m].innovations[i], 0, 0, p.datapointTextWrapLimit, p.datapointTitleLineHeight, false);
            innovationCount = innovationCount + innovationObj.linecounter;
        }

        lineLength = 20 + (titleObj.linecounter * p.datapointTitleLineHeight) + (dateObj.linecounter * p.datapointTitleLineHeight) + (innovationCount * p.datapointTitleLineHeight);

        if (lineOnTop == true) {
            // line
            CTX.beginPath();
            CTX.lineWidth = 2;
            CTX.moveTo((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY);
            CTX.lineTo((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY - lineLength);
            CTX.strokeStyle = p.datapointLineColor;
            CTX.stroke();

            // circle
            CTX.beginPath();
            CTX.arc((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY - lineLength - 5, 5, 0, Math.PI * 2, false);
            CTX.fillStyle = p.datapointCircleFillColor;
            CTX.fill();
            CTX.lineWidth = 2;
            CTX.strokeStyle = p.datapointCircleBorderColor;
            CTX.stroke();

            // title
            CTX.font = p.datapointTitleFont;
            CTX.fillStyle = p.datapointTitleColor;
            var titleObj = wrapText(CTX, timelineData[m].title, (DataPointOffsetX * count) + 60, p.timelineBarY - lineLength - 2, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

            // date
            CTX.font = p.datapointDateFont;
            CTX.fillStyle = p.datapointDateColor;
            var dateObj = wrapText(CTX, timelineData[m].eventdaterange, (DataPointOffsetX * count) + 60, titleObj.yaxis + p.datapointTitleLineHeight, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

            // innovations
            var lastLineYpos = dateObj.yaxis;
            for (var i = 0; i < timelineData[m].innovations.length; i++) {
                var innovationObj = wrapText(CTX, "• " + timelineData[m].innovations[i], (DataPointOffsetX * count) + 60, lastLineYpos + p.datapointTitleLineHeight, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);
                lastLineYpos = innovationObj.yaxis;
            }

            lineOnTop = false;
        }
        else {
            lineLength = 50;

            // line
            CTX.beginPath();
            CTX.lineWidth = 2;
            CTX.moveTo((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY + p.timeLineBarHeight);
            CTX.lineTo((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY + p.timeLineBarHeight + lineLength);
            CTX.strokeStyle = p.datapointLineColor;
            CTX.stroke();

            // circle
            CTX.beginPath();
            CTX.arc((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY + p.timeLineBarHeight + lineLength + 5, 5, 0, Math.PI * 2, false);
            CTX.fillStyle = p.datapointCircleFillColor;
            CTX.fill();
            CTX.lineWidth = 2;
            CTX.strokeStyle = p.datapointCircleBorderColor;
            CTX.stroke();

            // title
            CTX.font = p.datapointTitleFont;
            CTX.fillStyle = p.datapointTitleColor;
            var titleObj = wrapText(CTX, timelineData[m].title, (DataPointOffsetX * count) + 60, p.timelineBarY + p.timeLineBarHeight + lineLength + 8, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

            // date
            CTX.font = p.datapointDateFont;
            CTX.fillStyle = p.datapointDateColor;
            var dateObj = wrapText(CTX, timelineData[m].eventdaterange, (DataPointOffsetX * count) + 60, titleObj.yaxis + p.datapointTitleLineHeight, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

            // innovations
            var lastLineYpos = dateObj.yaxis;
            for (var i = 0; i < timelineData[m].innovations.length; i++) {
                var innovationObj = wrapText(CTX, "• " + timelineData[m].innovations[i], (DataPointOffsetX * count) + 60, lastLineYpos + p.datapointTitleLineHeight, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);
                lastLineYpos = innovationObj.yaxis;
            }

            lineOnTop = true;
        }
    }

}



function buildBubbleChart_Activity(properties, functionCallback) {

    // Canvas properties
    var canvasWidth = 1200;
    var canvasHeight = 650;
    var canvasZeroX = 70;
    var canvasZeroY = 580;
    var canvasBackgroundColor = "#ffffff";
    var canvasXYLineColor = "#eff6fc";

    // Horizontal lines
    var canvasHorizontalLineColor = '#E1E1E1';

    // Fonts for X-axis and Y-axis units
    var labelXYUnitsFont = "10px Segoe UI";
    var labelXYUnitsColor = "#605e5c";

    // Datapoint colors and fills
    var datapointTitleFont = "bold 14px Segoe UI";
    var datapointCircleBorderColor = "#106EBE";
    var datapointCircleFillColor = "#DEECF9";

    // Label fonts and texts
    var labelXYFont = 'bold 18px Segoe UI';
    var labelXYColor = '#888888';

    // -------------------------------------------

    // Init canvas
    var canvas = document.getElementById(properties.canvasId);
    var p = properties;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    var CTX = canvas.getContext('2d');
    CTX.clearRect(0, 0, canvasWidth, canvasHeight); // Clears canvas, useful for animation
    CTX.fillStyle = canvasBackgroundColor;

    // Render X,Y lines
    CTX.beginPath();
    CTX.lineWidth = 2;
    CTX.moveTo(canvasZeroX, 0);
    CTX.lineTo(canvasZeroX, canvasZeroY);
    CTX.lineTo(canvasWidth, canvasZeroY);
    CTX.strokeStyle = canvasXYLineColor;
    CTX.stroke();

    // Get max value for X and Y
    var maxX = 0;
    var maxY = 0;
    var minX = Number.MAX_VALUE;
    var minY = Number.MAX_VALUE;
    for (var e = 0; e < p.data.length; e++) {
        if (p.data[e].accountsactionedpercent > maxX) {
            maxX = p.data[e].accountsactionedpercent;
        }

        if (p.data[e].accountsactionedpercent < minX) {
            minX = p.data[e].accountsactionedpercent;
        }

        if (p.data[e].meetingscompletedpercent > maxY) {
            maxY = p.data[e].meetingscompletedpercent;
        }

        if (p.data[e].meetingscompletedpercent < minY) {
            minY = p.data[e].meetingscompletedpercent;
        }
    }

    // Add padding and round to nearest 10s or 100s
    if (maxX < 10) {
        maxX = Math.ceil(maxX / 10) * 10;
    }
    else {
        maxX = Math.ceil(maxX / 100) * 100;
    }

    if (maxY < 10) {
        maxY = Math.ceil(maxY / 10) * 10;
    }
    else {
        maxY = Math.ceil(maxY / 100) * 100;
    }
    minX = Math.floor(minX) - 10;
    minY = Math.floor(minY) - 10;


    if (minX < 25) {
        minX = 0;
    }

    if (minY < 25) {
        minY = 0;
    }

    // ========================================
    // Render diagonal line (hardcoded)
    //CTX.beginPath();
    //CTX.lineWidth = 6;
    //CTX.moveTo(canvasZeroX, canvasZeroY);
    //CTX.lineTo(canvas.width, 20);
    //CTX.strokeStyle = canvasXYLineColor;
    //CTX.stroke();
    // ========================================

    // ========================================
    // Render diagonal line (using math)
    CTX.beginPath();
    CTX.lineWidth = 6;
    CTX.moveTo(canvasZeroX, canvasZeroY);

    var chart_length = canvasWidth - canvasZeroX;
    var chart_height = canvasZeroY;
    var diagonal_length = Math.floor(Math.sqrt(chart_length * chart_length + chart_height * chart_height));

    var chart_divider_x = 1;
    if (maxX >= 100) {
        chart_divider_x = maxX / 100;
    }

    var chart_divider_y = 1;
    if (maxY >= 100) {
        chart_divider_y = maxY / 100;
    }

    var chart_virtual_width = chart_length / chart_divider_x;
    var chart_virtual_height = chart_height / chart_divider_y;
    var rad = Math.atan(chart_virtual_height / chart_virtual_width);
    var chart_diagonal_degrees = -Math.abs(Math.floor(rad * (180 / Math.PI))) + .2;

    CTX.lineTo(canvasZeroX + diagonal_length * Math.cos(Math.PI * chart_diagonal_degrees / 180.0), canvasZeroY + diagonal_length * Math.sin(Math.PI * chart_diagonal_degrees / 180.0));
    CTX.strokeStyle = canvasXYLineColor;
    CTX.stroke();
    // ========================================

    // Render Y-axis lines and label units
    var yAxisUnitScale = 550 / (maxY / 10);
    var tickInterval = maxY / 10;
    var tickValue = 0;
    for (var m = 1; m < 11; m++) {
        CTX.beginPath();
        CTX.lineWidth = .5;
        CTX.moveTo(canvasZeroX, canvasZeroY - (m * 55));
        CTX.lineTo(canvasWidth, canvasZeroY - (m * 55));
        CTX.strokeStyle = canvasHorizontalLineColor;
        CTX.stroke();

        CTX.beginPath();
        CTX.font = labelXYUnitsFont;
        CTX.fillStyle = labelXYUnitsColor;
        CTX.textAlign = 'right';
        tickValue = Math.round(tickValue + tickInterval);
        CTX.fillText(tickValue + "%", canvasZeroX - 5, canvasZeroY - (m * 55) + 3);
    }

    // Render Y-axis label (rotate vertically)
    var yAxisX = 8;
    var yAxisY = canvasZeroY / 2;
    CTX.font = labelXYFont;
    CTX.fillStyle = labelXYColor;
    CTX.save();
    CTX.translate(yAxisX, yAxisY);
    CTX.rotate(-Math.PI / 2);
    CTX.textAlign = 'center';
    CTX.fillText(p.labelYAxisText, 0, yAxisX);
    CTX.restore();

    // Render X-axis label units
    var xAxisUnitScale = 1100 / (maxX / 10);
    tickInterval = maxX / 10;
    tickValue = 0;
    for (var m = 1; m < 11; m++) {
        CTX.beginPath();
        CTX.font = labelXYUnitsFont;
        CTX.fillStyle = labelXYUnitsColor;
        CTX.textAlign = 'center';
        tickValue = Math.round(tickValue + tickInterval);
        CTX.fillText(tickValue + "%", canvasZeroX + (m * 110), canvasZeroY + 15);
    }

    // Render X-axis label
    CTX.beginPath();
    CTX.font = labelXYFont;
    CTX.fillStyle = labelXYColor;
    CTX.textAlign = 'center';
    CTX.fillText(p.labelXAxisText, canvasZeroX + ((canvasWidth - canvasZeroX) / 2), canvasZeroY + 50);

    // Render datapoints
    var datapointlist = [];
    for (var e = 0; e < p.data.length; e++) {
        CTX.beginPath();
        const datapoint = new Path2D();

        var xpos = (xAxisUnitScale * 10) * (p.data[e].accountsactionedpercent / 100);
        var ypos = (yAxisUnitScale * 10) * (p.data[e].meetingscompletedpercent / 100);
        datapoint.arc(canvasZeroX + xpos, canvasZeroY - ypos, 30, 0, Math.PI * 2, false);
        CTX.fillStyle = datapointCircleFillColor;
        var circleBorderWidth = p.data[e].msxopportunitypercent;
        if (circleBorderWidth < 10) {
            circleBorderWidth = 10;
        } else if (circleBorderWidth > 100) {
            circleBorderWidth = 100;
        }
        CTX.lineWidth = (circleBorderWidth / 10);
        CTX.strokeStyle = datapointCircleBorderColor;
        CTX.fill(datapoint);
        CTX.stroke(datapoint);
        datapointlist.push(datapoint);

        // Render initials
        var getInitials = function (string) {
            var names = string.split(' '),
                initials = names[0].substring(0, 1).toUpperCase();

            if (names.length > 1) {
                initials += names[names.length - 1].substring(0, 1).toUpperCase();
            }
            return initials;
        };

        CTX.font = datapointTitleFont;
        CTX.fillStyle = datapointCircleBorderColor;
        CTX.textAlign = 'center';
        CTX.fillText(getInitials(p.data[e].fullname), canvasZeroX + xpos, (canvasZeroY - ypos) + 5);
    }

    // Event listener for hover/highlight on each datapoint
    canvas.addEventListener('mousemove', function (event) {
        event = event || window.event;
        for (var i = datapointlist.length - 1; i >= 0; i--) {
            if (datapointlist[i] && CTX.isPointInPath(datapointlist[i], event.offsetX, event.offsetY)) {
                //Hover over datapoint
                canvas.style.cursor = 'pointer';
                return
            } else {
                //Default when not in hover
                canvas.style.cursor = 'default';
            }
        }
    });

    //Event listener for action on a datapoint
    canvas.addEventListener('mousedown', function (event) {
        event = event || window.event;
        for (var i = datapointlist.length - 1; i >= 0; i--) {

            var chartdialog = document.getElementById("chartdialog");

            if (datapointlist[i] && CTX.isPointInPath(datapointlist[i], event.offsetX, event.offsetY)) {

                var markup = `
                <table border='0' style='white-space: nowrap; font-family: Segoe UI; font-size: 14px;'>
                <tr>
                    <td colspan='2' style='font-size: 16px; font-weight: bold;'>` + p.data[i].fullname + `</td>
                    <td style='width: 100px; text-align: right;'><a href='#' onclick='` + functionCallback + `(` + p.data[i].id + `)' style='color: #106ebe; text-decoration: underline;'>View</a></td>
                </tr>
                <tr>
                    <td style='width: 100px;'>Assigned</td>
                    <td style='width: 100px; font-weight: bold;'>` + p.data[i].assigned + `</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Actioned</td>
                    <td style='font-weight: bold;'>` + p.data[i].accountsactionedcount + ` (` + p.data[i].accountsactionedpercent + `%)` + `</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Mtg Comp.</td>
                    <td style='font-weight: bold;'>` + p.data[i].meetingscompletedcount + ` (` + p.data[i].meetingscompletedpercent + `%)` + `</td>
                    <td></td>
                </tr>
                <tr>
                    <td>MSX Opp.</td>
                    <td style='font-weight: bold;'>` + p.data[i].msxopportunitycount + ` (` + p.data[i].msxopportunitypercent + `%)` + `</td>
                    <td></td>
                </tr>
                </table>
                `;

                chartdialog.innerHTML = markup;
                chartdialog.style.position = "absolute";
                chartdialog.style.display = "block";
                chartdialog.style.zIndex = "101"
                chartdialog.style.left = (event.pageX) - 150 + "px";
                chartdialog.style.top = (event.pageY) + 15 + "px";

                return;
            }
            else {
                chartdialog.style.display = "none";
            }
        }
    });
}


// ================
// Common functions
// ================

function centerText(context, text, x, y, maxWidth, lineHeight, rendertext) {
    var textLength = context.measureText(text);
    context.fillText(text, x - (textLength.width / 2), y + 1);
}

function wrapText(context, text, x, y, maxWidth, lineHeight, rendertext) {
    var words = text.split(' ');

    var isBulletItem = false;
    var indent = "";
    if (words[0] == "•") {
        isBulletItem = true;
    }

    var line = '';
    var linecounter = 0;
    var maxtextwidth = 0;

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        //console.log("*** " + text + " - " + words[n] + " ----- width: " + testWidth);

        if (testWidth > maxWidth && n > 0) {
            if (rendertext == true) {
                indent = "";
                if (isBulletItem && line.indexOf("•") == -1) {
                    indent = "   ";
                }

                // Not last line of wrapped text
                context.fillText(indent + line, x, y);

                var textmeasure = context.measureText(line);
                if (textmeasure.width > maxtextwidth) {
                    maxtextwidth = textmeasure.width;
                }
            }

            linecounter++;
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
            var textmeasure = context.measureText(line);
            maxtextwidth = textmeasure.width;
        }
    }

    if (rendertext == true) {
        indent = "";
        if (isBulletItem && line.indexOf("•") == -1) {
            indent = "   ";
        }

        // Last line of wrapped text
        context.fillText(indent + line, x, y);

        var textmeasure = context.measureText(line);
        if (textmeasure.width > maxtextwidth) {
            maxtextwidth = textmeasure.width;
        }
    }

    linecounter++;

    var textobj = {
        linecounter: linecounter,
        maxwidth: Math.floor(maxtextwidth),
        yaxis: y
    };

    return textobj;
}

function drawStar(context, cprop, cx, cy, spikes, outerRadius, innerRadius) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    context.beginPath();
    context.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y)
        rot += step
    }
    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = cprop.starBorderColor;
    context.stroke();
    context.fillStyle = cprop.starFillColor;
    context.fill();
}