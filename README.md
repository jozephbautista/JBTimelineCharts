## TimelineCharts

Author: Jozeph Bautista\
LinkedIn: https://www.linkedin.com/in/jozephbautista/ \
GitHub: https://github.com/jozephbautista

---

**Custom Timeline charts using HTML5 Canvas**

This project was created due to some project requirements that needed a specific timeline chart layout. And since I couldn't find anything available online (free or paid) that would meet the requirements, I created this Timeline chart from scratch. Please feel free to use/modify it as needed for your project.

<!-- To upload new image screenshots: On GitHub.com, create an issue, attach images(s) by dragging to "write" window, but don't submit the issue. The uploaded image url(s) will show up inside the "Write" window. -->
<img src="https://user-images.githubusercontent.com/17344628/115454510-b44d4180-a1d5-11eb-8408-8bd23be61b8d.JPG" width="100%"></img>
<img src="https://user-images.githubusercontent.com/17344628/115454513-b4e5d800-a1d5-11eb-821f-5507dca2d454.JPG" width="100%"></img>
<img src="https://user-images.githubusercontent.com/17344628/115454515-b4e5d800-a1d5-11eb-8f98-e92d7c7d6eaf.JPG" width="100%"></img> 


**Usage:** Please refer to the index.cshtml file to see a complete example.

1. On your HTML file, create a reference to the timeline library:

```
    <script src="~/js/JBTimelineCharts.js"></script>
```

2. Next, create the canvas tag:

```
    <canvas id="Timeline_Standard" style="border: 1px solid #DDDDDD;"></canvas>
```

3. Create your canvas properties object: (see index.cshtml for complete details)

```
    var canvas_properties = {...}
```

4. Create your data object:

```
    function TimelineData_Standard(tile, month, eventdaterange, eventtype, innovations) {
        this.title = tile;
        this.month = month;
        this.eventdaterange = eventdaterange;
        this.eventtype = eventtype;
    };

    var timelineDataList_Standard = [];
    timelineDataList_Standard.push(new TimelineData_Standard('Dev Summit', months.MAY, 'May 6', eventtypes.KEYMOMENT));
    timelineDataList_Standard.push(new TimelineData_Standard('Dev Days', months.MAY, 'May 16-17', eventtypes.FIRSTPARTYEVENT));
    timelineDataList_Standard.push(new TimelineData_Standard('Dev Focus', months.MAY, 'May 18-20', eventtypes.FIRSTPARTYEVENT));
```

5. Render your data:

```
    renderTimelineChart(canvas_properties, timelineDataList_Standard);
```


