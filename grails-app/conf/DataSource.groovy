dataSource {
    pooled = true
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""

    //driverClassName = "org.postgresql.Driver"
    //username = "postgres"
    //password = "postgres"
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory' // Hibernate 3
//    cache.region.factory_class = 'org.hibernate.cache.ehcache.EhCacheRegionFactory' // Hibernate 4
}

// environment specific settings
environments {
    development {
        dataSource {
            dbCreate = "create-drop" // one of 'create', 'create-drop', 'update', 'validate', ''
            //para que se grabe en disco hay que sacar :mem de la url
            url = "jdbc:h2:mem:devDb;MVCC=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE"
            //dbCreate = "update" // one of 'create', 'create-drop','update'
            //url = "jdbc:postgresql://localhost:5432/triage_dev"
        }
    }
    test {
        dataSource {
            dbCreate = "update"
            url = "jdbc:h2:mem:testDb;MVCC=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE"
        }
    }
    /*production {
        dataSource {
            dbCreate = "update"
            url = "jdbc:h2:prodDb;MVCC=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE"
            properties {
               maxActive = -1
               minEvictableIdleTimeMillis=1800000
               timeBetweenEvictionRunsMillis=1800000
               numTestsPerEvictionRun=3
               testOnBorrow=true
               testWhileIdle=true
               testOnReturn=false
               validationQuery="SELECT 1"
               jdbcInterceptors="ConnectionState"
            }
        }
    }*/

    //H2 + TOMCAT
    //fuente: http://sporcic.org/2012/09/using-h2-with-grails-and-tomcat/   NOTA:crear directorio db, como dice en el link y hacerle $chown tomcat7:tomcat7
    production {
    dataSource {
        dbdir = "${System.properties['catalina.base']}/db/baseH2"
 
        dbCreate = "update"
        url = "jdbc:h2:file:${dbdir};MVCC=TRUE;LOCK_TIMEOUT=10000"
        pooled = true
 
        properties {
            maxActive = -1
            minEvictableIdleTimeMillis=1800000
            timeBetweenEvictionRunsMillis=1800000
            numTestsPerEvictionRun=3
            testOnBorrow=true
            testWhileIdle=true
            testOnReturn=true
            validationQuery="SELECT 1"
        }
    }
}



    //CONFIGURACION POSTGRES PARA HEROKU. https://devcenter.heroku.com/articles/getting-started-with-grails
    /*production {
        dataSource {
            dbCreate = "update"
            driverClassName = "org.postgresql.Driver"
            dialect = org.hibernate.dialect.PostgreSQLDialect

            //busca la variable de entorno DATABASE_URL, si no la encuentra toma lo q se pasa en el else, despues de ?:
            uri = new URI(System.env.DATABASE_URL?:"postgres://postgres:postgres@localhost/triage_dev")//el primer postgres es el usuario, el segundo es la pass y triage_dev es la base de datos

            url = "jdbc:postgresql://"+uri.host+uri.path
            username = uri.userInfo.split(":")[0]
            password = uri.userInfo.split(":")[1]
        }
}*/
}
