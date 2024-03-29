package com.zz.servlet;

import com.zz.chart.data.ClassData;
import com.zz.chart.data.IndicatorData;
import com.zz.util.Classifiter;
import com.zz.util.JUtil;
import com.zz.util.NetworkUtil;
import com.zz.util.imageUtil;
import jdk.nashorn.api.scripting.ClassFilter;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import sun.awt.SunHints;
import sun.misc.BASE64Encoder;
import telecarto.data.util.ColorUtil;
import telecarto.geoinfo.db.MysqlAccessBean;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Properties;

@WebServlet(name = "ClassLayerServletForZJ")
public class ClassLayerServletForZJ extends HttpServlet {

    public ClassLayerServletForZJ() {
        super();
    }/**
     * Destruction of the servlet. <br>
     */
    public void destroy() {
        super.destroy(); // Just puts "destroy" string in log
        // Put your code here
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet( request,  response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json;charset=UTF-8");//返回json格式的数据
        request.setCharacterEncoding("UTF-8");//设置服务器端对前端传输数据的解码方式!!!
        doClassLayer(request,response);

    }
    public void doClassLayer(HttpServletRequest request, HttpServletResponse response){

        String ip = NetworkUtil.getIpAddr(request);
        JSONObject dataJson = JSONObject.fromObject(request.getParameter("allTjLayerContent"));
        JSONObject statisticdataJson=JSONObject.fromObject(dataJson.getJSONObject("statisticdata"));

        String thematicMapName=statisticdataJson.getString("thematicMapName");//专题图名称

        JSONArray dataFieldNames=statisticdataJson.getJSONArray("fieldsName");

        JSONObject cartographydataJson=JSONObject.fromObject(dataJson.getJSONObject("cartographydata"));

        int breakNum = Integer.parseInt(cartographydataJson.getString("classNumSliderValue"));
        String breakMethod=cartographydataJson.getString("modelName");

        String regionParam = request.getParameter("regionParam");

        String color = cartographydataJson.getString("colors");
        String  colors[]= color.trim().split(";");
        System.out.println(colors);


        String url=statisticdataJson.getString("dataAddress");
        String legendName="";//图例标题名称

        ArrayList<ClassData> classList=new ArrayList<>();
        ArrayList<ClassData> classListForParam2=new ArrayList<>();

        String resultString= JUtil.getResultStrFromAPI(url);
        try {
            JSONObject nameAtGeometry=new JSONObject();
            JSONObject isTimeSeries=new JSONObject();
            isTimeSeries.put("isTimeSeries",false);

            //读取配置文件
            String configpath = JUtil.GetWebInfPath()+"/prop/thematicMap.properties";
            Properties pro = new Properties();
            pro.load(new InputStreamReader(new BufferedInputStream(new FileInputStream(configpath)),"GBK"));

            switch (thematicMapName){
                case "101"://评价活跃度专题图处理
                    //获取人口数据
                    classList = JUtil.getClassDataFromAPIV2(resultString,"评价数",regionParam,nameAtGeometry,isTimeSeries);
                    JSONObject popObj=JUtil.getThematicDataFromDatabase("population",
                            "region","population_zj");
                    for(int i=0;i<classList.size();i++){
                        ClassData tmpClassData=classList.get(i);

                        Double each_thematicData=Double.parseDouble(tmpClassData.getData());
                        Double each_popData=Double.parseDouble(popObj.getString(tmpClassData.getName()));
                        tmpClassData.getOtherDataValue().add(each_thematicData);
                        tmpClassData.getOtherDataValue().add(each_popData);
                        tmpClassData.getOtherDataLabel().add("评价人数");
                        tmpClassData.getOtherDataLabel().add("人口数");

//                            System.out.print(i);
                        tmpClassData.setData( String.valueOf(each_thematicData/each_popData*1000));
                        tmpClassData.setLabel("评价活跃度");
                        classList.set(i,tmpClassData);
                    }
                    legendName="评价活跃度";
                    break;
                case "102"://事项评价覆盖率专题图处理
                    classList = JUtil.getClassDataFromAPIV2(resultString,"点评项目数",regionParam,nameAtGeometry,isTimeSeries);
                    classListForParam2=JUtil.getClassDataFromAPIV2(resultString,"项目总数",regionParam,nameAtGeometry,isTimeSeries);

                    for(int i=0;i<classList.size();i++){
                        Double each_thematicData1=Double.parseDouble(classList.get(i).getData());
                        Double each_thematicData2=Double.parseDouble(classListForParam2.get(i).getData());
                        System.out.print(i);
                        classList.get(i).setData( String.valueOf(each_thematicData1/each_thematicData2));
                        classList.get(i).setLabel("事项评价覆盖率");
                        classList.get(i).getOtherDataValue().add(each_thematicData1);
                        classList.get(i).getOtherDataValue().add(each_thematicData2);
                        classList.get(i).getOtherDataLabel().add("评价的项目数");
                        classList.get(i).getOtherDataLabel().add("项目总数");

                    }
                    legendName="事项评价覆盖率";
                    break;
                default:
                    classList = JUtil.getClassDataFromAPIV2(resultString,dataFieldNames.getString(0),regionParam,nameAtGeometry,isTimeSeries);
                    legendName=dataFieldNames.getString(0);
            }
            double maxValue =  Double.parseDouble(classList.get(0).getData());
            double minValue = Double.parseDouble(classList.get(0).getData());
            String testData="";
            for (int i=0;i<classList.size();i++){
                testData=testData+classList.get(i).getData()+",";
                if(Double.parseDouble(classList.get(i).getData())>maxValue){
                    maxValue = Double.parseDouble(classList.get(i).getData());
                    System.out.print(i);
                }
                if(Double.parseDouble(classList.get(i).getData())<minValue){
                    minValue = Double.parseDouble(classList.get(i).getData());
                }
            }

            //采用对应的分类方法,根据各区域的数据值进行分类,并赋予颜色
            JSONArray classDataArray = Classifiter.getClassIntervalJson(minValue,maxValue,breakNum,classList,colors,breakMethod);
            double []classInterval = Classifiter.getIntervals(minValue,maxValue,breakNum,breakMethod);

            //绘制分级图例
            String imgStreamLegend=drawLegend(classInterval,breakNum,legendName,colors,ip);
            JSONObject classObject = new JSONObject();

            //传输JSON分级grapgics数组到前端
            classObject.put("classDataArray",classDataArray);
            classObject.put("dataSource",url);
            classObject.put("isTimeSeries",isTimeSeries.getBoolean("isTimeSeries"));
            classObject.put("nameAtGeometry",nameAtGeometry);
            classObject.put("classLegend",imgStreamLegend.replaceAll("[\\s*\t\n\r]", ""));
            PrintWriter out = response.getWriter();
            out.print(classObject);
            out.flush();
            out.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

       // }

    }
    public String drawLegend(double []classInterval,int breakNum,String dataFieldName,String[] colors,String ip) throws IOException {
        //绘制分级图图例

        int width = 225;
        int height = 21 * breakNum+45;
        BufferedImage image = new BufferedImage(width, height,
                BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();

        g2d.setColor(Color.white);

        g2d.fillRect(0,0,image.getWidth(),image.getHeight());
        g2d.dispose();

        g2d = image.createGraphics();
        //文字抗锯齿化处理
        g2d.setRenderingHint(SunHints.KEY_ANTIALIASING, SunHints.VALUE_ANTIALIAS_ON);

        Font font = new Font("黑体", Font.PLAIN, 17);
        g2d.setFont(font);
        g2d.setColor(Color.black);

        // 获取图例标题的像素范围对象
        double fontWidth = imageUtil.getTitleSize(g2d,font,dataFieldName);
        int stringWidth = new BigDecimal(fontWidth).setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
        int startX = new BigDecimal((225.0 - stringWidth)/2).setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
        if(startX>0){
            g2d.drawString(dataFieldName, startX, 25);
        }
        else {
            g2d.setFont(new Font("黑体", Font.PLAIN, 16));
            fontWidth = imageUtil.getTitleSize(g2d,font,dataFieldName);
            stringWidth = new BigDecimal(fontWidth).setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
            startX = new BigDecimal((225 - stringWidth)/2).setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
            g2d.drawString(dataFieldName, startX, 25);
        }

        font = new Font("", Font.PLAIN, 13);
        g2d.setFont(font);

        for (int i=0;i<colors.length;i++){
            String temp = colors[i].substring(colors[i].indexOf("(") + 1, colors[i].indexOf(")"));
            String[] rgbTemp = temp.trim().split(",");
            //绘制空心矩形(色块边线)
            g2d.setColor(Color.black);
            g2d.drawRect(20,i*21+37,28,16);
            //设置颜色-->色块
            g2d.setColor(new Color(Integer.parseInt(rgbTemp[0].trim()), Integer
                    .parseInt(rgbTemp[1].trim()), Integer.parseInt(rgbTemp[2].trim())));
            //绘制实心矩形色块
            g2d.fillRect(21,i*21+37+1,27,15);
            //设置颜色-->文字
            g2d.setColor(Color.black);
            if(i == 0){
                String legendStr = "< " + classInterval[0];
                g2d.drawString(legendStr, 55, i*21+39+12);
            }
            else if(i==colors.length-1){
                String legendStr = ">= " + classInterval[i-1];
                g2d.drawString(legendStr, 55, i*21+39+12);
            }
            else {
                String legendStr;
                legendStr = classInterval[i-1] + " ~ " + classInterval[i];
                g2d.drawString(legendStr, 55, i*21+39+12);
            }
        }
        g2d.dispose();
        //图例图片转码为base64
        BASE64Encoder encoderLegend = new sun.misc.BASE64Encoder();
        ByteArrayOutputStream baosLegend = new ByteArrayOutputStream();
        ImageIO.setUseCache(false);
        ImageIO.write(image, "png", baosLegend);
        byte[] bytesLegend = baosLegend.toByteArray();
        String imgStreamLegend = encoderLegend.encodeBuffer(bytesLegend).trim();
        //输出分级图图例到本地

        String tempFilePath = getServletContext().getRealPath("/") + "printMap/" + ip.replaceAll("\\.","-");
        File fileSavepath = new File(tempFilePath);
        if(!fileSavepath.exists()){
            fileSavepath.mkdirs();
        }
        String imgPath = tempFilePath + "/"+"classLegend.png";
        ImageIO.write(image, "png", new File(imgPath));

        return imgStreamLegend;
    }
}
