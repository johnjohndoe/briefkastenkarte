#!/bin/bash
# Briefkastenkarte Copyright (C) 2015 Danilo Bretschneider
# This program comes with ABSOLUTELY NO WARRANTY.
# See https://wiki.openstreetmap.org/wiki/DE:Briefkastenkarte for details.

# path to the project directory
PROJECTPATH=/home/bretschneider/Git/briefkastenkarte/report
# directory where the osm file and other data files are stored, can be equal to PROJECTPATH
DATAPATH=/home/bretschneider/Git/briefkastenkarte/report/tmp

cd $DATAPATH

echo "Started processing at $(date)"

# download osm file if not existing
echo "Getting OSM file if necessary"
if [ ! -f germany.pbf ]; then
	echo "OSM file not existing, now downloading it"
	wget http://download.geofabrik.de/europe/germany-latest.osm.pbf
	mv germany-latest.osm.pbf germany.pbf
	else
		echo "OSM file exists"
		echo ""
fi
echo ""

# convert osm file
echo "Converting OSM file"
echo ""
osmconvert germany.pbf --drop-author --out-o5m >temp.o5m
echo ""

# pre-filter osm file
echo "Filtering OSM file"
echo ""
osmfilter temp.o5m --keep="amenity=post_box" --out-osm > germany_post_box.osm
rm temp.o5m
echo ""

# pre-filter osm file
echo "Generate list of all available keys"
echo ""
xmllint --shell germany_post_box.osm <<< `echo 'cat /osm/node[*]/tag/@k'` | grep = | sort | uniq | sed 's/ k="//g' | sed 's/"//g' > germany_post_box.keys
echo ""

# analysze / count post box
echo "Count post box"
echo ""
count=`grep "<node" germany_post_box.osm | wc -l`
echo "$(date): $count" >> $PROJECTPATH/logs/post-box-count.log
echo ""

# create OSM postbox tag keys report
echo "Create OSM postbox tag keys report"
#rm -f $PROJECTPATH/index.html
cat germany_post_box.keys | while read i; do echo "<tr><td>$i</td><td>"; grep "k=\"$i\"" germany_post_box.osm | wc -l ; echo "</td></tr>" ; done > index.tmp
cat $PROJECTPATH/template/template_header.html index.tmp $PROJECTPATH/template/template_footer.html > cat.tmp
cp cat.tmp $PROJECTPATH/site/$(date "+%Y-%m-%d").html
rm -f cat.tmp index.tmp

echo "Finished processing at $(date)."
