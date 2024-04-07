<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" >

<xsl:template match = "/" >
  <html>
    <head>
      <title></title>
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="tipitaka.css" type="text/css"/>
    </head>
    <body>
      <article>
        <xsl:apply-templates select="/*"/>
      </article>
    </body>
  </html>
</xsl:template>

<xsl:template match="p">
  <p class="para">
    <xsl:if test="@n">
      <b class="paranum">
        <xsl:value-of select="@n"/>
      </b>. 
    </xsl:if>
    <xsl:apply-templates/>
  </p>
</xsl:template>

<xsl:template match="note">
  <span class="note">[<xsl:apply-templates/>]</span>
</xsl:template>

<xsl:template match="bold">
  <b><xsl:apply-templates/></b>
</xsl:template>

<xsl:template match="namo">
  <p class="namo">
    <xsl:apply-templates/>
  </p>
</xsl:template>

<xsl:template match="nikaya">
  <h3 class="nikaya">
    <xsl:apply-templates/>
  </h3>
</xsl:template>

<xsl:template match="book">
  <h2 class="book">
    <xsl:apply-templates/>
  </h2>
</xsl:template>

<xsl:template match="h1">
  <h1><xsl:apply-templates/></h1>
</xsl:template>

<xsl:template match="h2">
  <h2><xsl:apply-templates/></h2>
</xsl:template>

<xsl:template match="h3">
  <h3><xsl:apply-templates/></h3>
</xsl:template>

<xsl:template match="end">
  <h4 class="end">
    <xsl:apply-templates/>
  </h4>
</xsl:template>

</xsl:stylesheet>