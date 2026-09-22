<?php
/*
 * sitemap.php
 * -----------
 * Emits a Google Sitemap XML document of every public HTML page.
 *
 * Lives in the web root on purpose. PHP on nano.nau.edu cannot write files
 * in this space, so a generated sitemap_mpact.xml sitting next to the site
 * would go stale (or never get written). Serving the list on request means
 * crawlers always see the current page set, and anyone who opens
 * /sitemap.php (or the advertised /sitemap_mpact.xml rewrite) can read it.
 *
 * Only public pages are listed. Internal files — form processors, includes,
 * PHPMailer, JSON, docs, data — are never scanned, so they never appear.
 * The knowledge-base directory is included as trailing-slash URLs so MkDocs
 * pages are advertised without listing assets or 404.html.
 *
 * GEO plan item #4: robots.txt already advertises a sitemap; this is the
 * file that makes that URL resolve. lastmod is omitted on purpose — file
 * mtimes on a static deploy are not content-change dates, and a wrong date
 * is worse for search than none.
 */

header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=3600');

$baseUrl = 'https://nano.nau.edu';
$root = realpath(__DIR__);

// Directories that hold public pages. Anything else in the web space is
// ignored — this is not a directory listing of the server.
$scanDirs = array(
    '',
    'About_Equipment',
);

// Duplicate / superseded HTML that still sits in the web root. Each already
// canonicals to a live page; listing them here would split crawl attention.
$excludeFiles = array(
    'OLD_CHIPS_Scholars_Program.html' => true,
    'SCEAcademicPathways.html' => true,
    'TEM_Prep_Disk_Grinder.html' => true,
    'TEM_Prep_Dimple_Grinder.html' => true,
    'TEM_Prep_Ion_Beam_Mill.html' => true,
);

$pages = array();

foreach ($scanDirs as $relDir) {
    $dir = $relDir === '' ? $root : $root . DIRECTORY_SEPARATOR . $relDir;
    if (!is_dir($dir)) {
        continue;
    }

    $handle = opendir($dir);
    if ($handle === false) {
        continue;
    }

    while (($name = readdir($handle)) !== false) {
        if ($name === '.' || $name === '..') {
            continue;
        }
        if (!preg_match('/\.html$/i', $name)) {
            continue;
        }
        if (isset($excludeFiles[$name])) {
            continue;
        }

        $full = $dir . DIRECTORY_SEPARATOR . $name;
        if (!is_file($full)) {
            continue;
        }

        $pages[] = ($relDir === '' ? $name : $relDir . '/' . $name);
    }

    closedir($handle);
}

// Knowledge-base pages are MkDocs directory URLs (index.html behind a trailing slash).
// Walk only index.html files so assets, 404, and search JSON stay out of the sitemap.
$kbRoot = $root . DIRECTORY_SEPARATOR . 'knowledge-base';
if (is_dir($kbRoot)) {
    $kbIter = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($kbRoot, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($kbIter as $file) {
        if (!$file->isFile()) {
            continue;
        }
        if (strtolower($file->getFilename()) !== 'index.html') {
            continue;
        }
        $rel = str_replace('\\', '/', substr($file->getPathname(), strlen($root) + 1));
        if (strpos($rel, '/404') !== false) {
            continue;
        }
        $dir = dirname($rel);
        $pages[] = ($dir === 'knowledge-base') ? 'knowledge-base/' : $dir . '/';
    }
}

// Homepage first, then A–Z by path so the document is stable across requests.
usort($pages, function ($a, $b) {
    if ($a === 'index.html') {
        return -1;
    }
    if ($b === 'index.html') {
        return 1;
    }
    return strcasecmp($a, $b);
});

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($pages as $relPath) {
    $loc = $baseUrl . '/' . str_replace('%2F', '/', rawurlencode($relPath));
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($loc, ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</loc>\n";
    echo "  </url>\n";
}

echo "</urlset>\n";
