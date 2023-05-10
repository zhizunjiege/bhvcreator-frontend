<template>
  <q-card flat class="q-mx-auto q-my-xl transparent h-card">
    <q-card-section class="text-center text-h6"> 表达式示例 </q-card-section>
    <q-card-section>
      <pre class="bg-secondary"><code>
  if (not scannedInfo.length())
      0
  else
      atan2(
          scannedInfo[enemy_index].position.x - selfInfo.position.x,
          scannedInfo[enemy_index].position.y - selfInfo.position.y
      )
    </code></pre>
    </q-card-section>
    <q-card-section class="text-center text-h6"> 语法参考 </q-card-section>
    <q-card-section>
      <p class="text-subtitle1">类型</p>
      <q-markup-table flat bordered separator="cell" class="h-table">
        <thead>
          <tr>
            <th>符号</th>
            <th colspan="4">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-accent">f64</td>
            <td colspan="4">64位浮点数</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section>
      <p class="text-subtitle1">关键字</p>
      <q-markup-table flat bordered separator="cell" class="h-table">
        <thead>
          <tr>
            <th>分类</th>
            <th colspan="4">符号</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>分支</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>if else</code></pre>
            </td>
          </tr>
          <tr>
            <td>循环</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>while for break continue</code></pre>
            </td>
          </tr>
          <tr>
            <td>函数</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>func return</code></pre>
            </td>
          </tr>
          <tr>
            <td>声明</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>extern var const auto</code></pre>
            </td>
          </tr>
          <tr>
            <td>逻辑</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>not and or xor</code></pre>
            </td>
          </tr>
          <tr>
            <td>常量</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>true false</code></pre>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section>
      <p class="text-subtitle1">运算符</p>
      <q-markup-table flat bordered separator="cell" class="h-table">
        <thead>
          <tr>
            <th>分类</th>
            <th colspan="4">符号</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>乘除</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>* / %</code></pre>
            </td>
          </tr>
          <tr>
            <td>加减</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>+ -</code></pre>
            </td>
          </tr>
          <tr>
            <td>比较</td>
            <td class="text-accent" colspan="4">
              <pre
                class="q-my-none"
              ><code>&gt; &lt; &gt;= &lt;= == !=</code></pre>
            </td>
          </tr>
          <tr>
            <td>逻辑</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>&& ||</code></pre>
            </td>
          </tr>
          <tr>
            <td>赋值</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>=</code></pre>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section>
      <p class="text-subtitle1">预置函数</p>
      <q-markup-table flat bordered separator="cell" class="h-table">
        <thead>
          <tr>
            <th>分类</th>
            <th colspan="4">符号</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>三角</td>
            <td class="text-accent" colspan="4">
              <pre
                class="q-my-none"
              ><code>sin cos tan cot asin acos atan atan2</code></pre>
            </td>
          </tr>
          <tr>
            <td>数值</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>abs fabs min max floor</code></pre>
            </td>
          </tr>
          <tr>
            <td>幂次</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>pow sqrt</code></pre>
            </td>
          </tr>
          <tr>
            <td>指数</td>
            <td class="text-accent" colspan="4">
              <pre class="q-my-none"><code>exp</code></pre>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.h-card {
  width: 50%;
}
.h-table {
  border-color: var(--ui-secondary) !important;
  :deep(table) {
    table-layout: fixed;
    th,
    td {
      font-size: 1rem !important;
      padding: 0.5rem 1.5rem !important;
      border-color: var(--ui-secondary) !important;
      text-align: center;
    }
  }
}
</style>
