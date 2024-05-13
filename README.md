# Shepardess.net

Shepardess is a hub for stormchasing.

Update v1.0.2!!
```diff
+ Control panel redesign, espeically for mobile use.
+ Fixes to SPC polygons on the map.
+ Various smaller bugfixes, especially related to setting data on the backend.
+ Various smaller design fixes or asset updates.
```

Changelog (from Beta Version 0.9.1):
```diff
MAJOR:
+ Multi-streaming!
+ Custom stream URL option!
+ Drag and drop stream panel!
+ In-depth warnings and polygons!
+ SPC 1 & 2 day risk outlooks!
+ Panel and multi-stream resizing!
+ Streamer handles!
+ Past panel remodel!
+ Popup panel remodel!
+ Reduced site to one render!
+ Heavily reduced network size downloads!

 MINOR: 
+ Added much more info to SPC warning boxes, my current location, markers, and other polygons!
+ Added map key!
+ Added many filters and ease of accessibility to the warnings panel!
+ Mobile chat option in bottom panel!
+ Downsized message emote size (takes less characters).
+ Added message character color to signify when a message is near limit.
```

Bug and design fixes (since Beta Version 0.9.1):
```diff
BUG AND TECHNICAL:
--Entire site
+ Fixed all issues relating to portions of the site not automatically updating through websockets
--Featured panel
+ Fixed bug with Featured panel not displaying the featured stream (websocket race condition)
--Status and scrolling text 
+ Fixed bug and added fault tolerance to updates on the scrolling text feature (unhandled typing issue)
--Chat 
+ Fixed bug with emotes appearing in the wrong places in longer chat (mapping misconfig)
+ Fixed bug where new messages in chat could reset the message input field (bad component state handling on my part)
+ Fixed an issue where chat streamlinks wouldn't open with a stream open (clicked a non-existant object)
+ Fixed an issue where chat streamlinks wouldn't open the featured stream (double id reference)
+ Fixed an issue where chat streamlinks wouldn't update the name when streams refreshed
--Map 
+ Fixed an issue where future outlooks on the map
+ Fixed an issue with map objects (markers, polygons, etc) being on the wrong z-axis
--Warnings
+ Fixed an issue where the warning polygons would be flipped across the x-axis

DESIGN:
--Stream panel
+ Fixed many issues with display proportions for texts and icons in smaller streambox sizes.
+ Fixed streamgroup box proportions and scaling.
+ Implemented flexbox design on stream grid.
+ A LOT - and I mean a TON of icon and asset micro-updates to simplify or enhance designs.
```