<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>
          OpenUserCSS Sitemap
          <xsl:if test="sitemap:sitemapindex">Index</xsl:if>
        </title>
        <link rel="stylesheet" href="/css/sitemap.min.css"/>
      </head>
      <body>

        <div class="section container">
          <div class="tile is-ancestor">
            <div class="tile is-parent is-vertical">
              <div class="tile is-child">
                <div class="box">
                  <p>
                    This is a sitemap, which contains information for search
                    engines to index OpenUserCSS.
                  </p>
                </div>
              </div>

              <div class="tile is-child">
                <button class="button is-brand-primary" onclick="window.history.go(-1)">
                  If you arrived here by accident, click here to return to
                  where you were before.
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr/>

        <div class="section container">
          <div class="tile is-ancestor">
            <div class="tile is-parent is-vertical">
              <div class="tile is-child">
                <b>
                  This page is currently tracking
                  <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
                  URLs, including themes and profiles:
                </b>
              </div>
            </div>
          </div>
          <div class="tile is-ancestor">
            <div class="tile is-parent is-vertical">
              <div class="tile is-child">
                <xsl:apply-templates/>
              </div>
            </div>
          </div>
        </div>

      </body>
    </html>
  </xsl:template>


  <xsl:template match="sitemap:sitemapindex">
    <div>
      <div>
        <table class="table" cellspacing="0">
          <thead>
            <tr>
              <th style="width:60px"></th>
              <th>URL</th>
              <th style="width:200px">Last Modified</th>
            </tr>
          </thead>
          <tbody>
          <xsl:for-each select="sitemap:sitemap">
            <tr>
              <xsl:variable name="loc">
                <xsl:value-of select="sitemap:loc"/>
              </xsl:variable>
              <xsl:variable name="pno">
                <xsl:value-of select="position()"/>
              </xsl:variable>
              <td>
                <xsl:value-of select="$pno"/>
              </td>
              <td>
                <a href="{$loc}">
                  <xsl:value-of select="sitemap:loc"/>
                </a>
              </td>
              <xsl:if test="sitemap:lastmod">
              <td>
                <xsl:value-of select="concat(substring(sitemap:lastmod, 0, 11), concat(' ', substring(sitemap:lastmod, 12, 5)), concat(' ', substring(sitemap:lastmod, 20, 6)))"/>
              </td>
              </xsl:if>
              <xsl:apply-templates/>
            </tr>
          </xsl:for-each>
          </tbody>
        </table>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="sitemap:urlset">
    <div>
      <div>
        <table class="table is-fullwidth is-striped is-narrow is-hoverable">
          <thead>
            <tr>
              <td>URL</td>
              <xsl:if test="sitemap:url/sitemap:changefreq">
                <td>Change Freq.</td>
              </xsl:if>
              <xsl:if test="sitemap:url/sitemap:priority">
                <td>Priority</td>
              </xsl:if>
              <xsl:if test="sitemap:url/sitemap:lastmod">
                <td>Last Modified</td>
              </xsl:if>
            </tr>
          </thead>

          <tbody>
            <xsl:for-each select="sitemap:url">
              <tr>
                <xsl:variable name="loc">
                  <xsl:value-of select="sitemap:loc"/>
                </xsl:variable>
                <td>
                  <a href="{$loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <xsl:apply-templates select="sitemap:changefreq"/>
                <xsl:apply-templates select="sitemap:priority"/>
                <td>
                  <xsl:if test="sitemap:lastmod">
                    <xsl:value-of select="concat(substring(sitemap:lastmod, 0, 11), concat(' ', substring(sitemap:lastmod, 12, 5)), concat(' ', substring(sitemap:lastmod, 20, 6)))"/>
                  </xsl:if>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="sitemap:loc|sitemap:lastmod|image:loc|image:caption|video:*">
  </xsl:template>

  <xsl:template match="sitemap:changefreq|sitemap:priority">
    <td>
      <xsl:apply-templates/>
    </td>
  </xsl:template>

  <xsl:template match="image:image">
    <xsl:variable name="loc">
      <xsl:value-of select="image:loc"/>
    </xsl:variable>
    <p>
      <strong>Image: </strong>
      <a href="{$loc}">
        <xsl:value-of select="image:loc"/>
      </a>
      <xsl:if test="image:caption">
        <span>
          <xsl:value-of select="image:caption"/>
        </span>
      </xsl:if>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

</xsl:stylesheet>
